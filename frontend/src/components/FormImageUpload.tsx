import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { mediaUrl } from '../api/config'
import { readFormImageAsDataUrl } from '../lib/formImage'

type Props = {
  label: string
  value: string
  onChange: (next: string) => void
  wide?: boolean
  cropAspectRatio: number
}

type CropSession = {
  sourceUrl: string
  naturalWidth: number
  naturalHeight: number
}

type Position = {
  x: number
  y: number
}

type StageSize = {
  width: number
  height: number
}

const MAX_STAGE_WIDTH = 560
const MIN_STAGE_WIDTH = 200
const ZOOM_MIN = 1
const ZOOM_MAX = 2.75

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function loadImage(sourceUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load image.'))
    image.src = sourceUrl
  })
}

function getStageWidth() {
  if (typeof window === 'undefined') return MAX_STAGE_WIDTH
  return Math.min(MAX_STAGE_WIDTH, Math.max(MIN_STAGE_WIDTH, window.innerWidth - 72))
}

function getStageSize(stageWidth: number, cropAspectRatio: number): StageSize {
  return {
    width: stageWidth,
    height: stageWidth / cropAspectRatio,
  }
}

function getMetrics(stageSize: StageSize, naturalWidth: number, naturalHeight: number, zoom: number) {
  const baseScale = Math.max(stageSize.width / naturalWidth, stageSize.height / naturalHeight)
  const scale = baseScale * zoom
  const renderedWidth = naturalWidth * scale
  const renderedHeight = naturalHeight * scale
  return { scale, renderedWidth, renderedHeight }
}

function centerPosition(stageSize: StageSize, renderedWidth: number, renderedHeight: number): Position {
  return {
    x: (stageSize.width - renderedWidth) / 2,
    y: (stageSize.height - renderedHeight) / 2,
  }
}

function clampPosition(position: Position, stageSize: StageSize, renderedWidth: number, renderedHeight: number): Position {
  return {
    x: clamp(position.x, stageSize.width - renderedWidth, 0),
    y: clamp(position.y, stageSize.height - renderedHeight, 0),
  }
}

export function FormImageUpload({ label, value, onChange, wide, cropAspectRatio }: Props) {
  const reactId = useId()
  const inputId = `form-img-${reactId.replace(/:/g, '')}`
  const [error, setError] = useState<string | null>(null)
  const [cropSession, setCropSession] = useState<CropSession | null>(null)
  const [stageWidth, setStageWidth] = useState(() => getStageWidth())
  const [stageSize, setStageSize] = useState<StageSize>(() => getStageSize(getStageWidth(), cropAspectRatio))
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const cropFrameRef = useRef<HTMLDivElement | null>(null)
  const hasInitializedRef = useRef(false)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startPosition: Position
  } | null>(null)

  const cropMetrics = cropSession ? getMetrics(stageSize, cropSession.naturalWidth, cropSession.naturalHeight, zoom) : null

  useEffect(() => {
    if (!cropSession) {
      hasInitializedRef.current = false
      dragRef.current = null
      return
    }

    setStageWidth(getStageWidth())
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    hasInitializedRef.current = false
  }, [cropSession])

  useLayoutEffect(() => {
    if (!cropSession) return
    const frame = cropFrameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const nextStageSize = { width: rect.width, height: rect.height }
    const metrics = getMetrics(nextStageSize, cropSession.naturalWidth, cropSession.naturalHeight, zoom)

    setStageSize(nextStageSize)
    setPosition((current) => {
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true
        return centerPosition(nextStageSize, metrics.renderedWidth, metrics.renderedHeight)
      }
      return clampPosition(current, nextStageSize, metrics.renderedWidth, metrics.renderedHeight)
    })
  }, [cropSession, zoom])

  function closeCropSession() {
    hasInitializedRef.current = false
    dragRef.current = null
    setCropSession(null)
  }

  async function confirmCrop() {
    if (!cropSession) return

    try {
      const image = await loadImage(cropSession.sourceUrl)
      const metrics = getMetrics(stageSize, image.naturalWidth, image.naturalHeight, zoom)
      const boundedPosition = clampPosition(position, stageSize, metrics.renderedWidth, metrics.renderedHeight)
      const sourceX = clamp(-boundedPosition.x / metrics.scale, 0, image.naturalWidth)
      const sourceY = clamp(-boundedPosition.y / metrics.scale, 0, image.naturalHeight)
      const sourceWidth = Math.min(image.naturalWidth - sourceX, stageSize.width / metrics.scale)
      const sourceHeight = Math.min(image.naturalHeight - sourceY, stageSize.height / metrics.scale)

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(sourceWidth))
      canvas.height = Math.max(1, Math.round(sourceHeight))

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Could not crop image.')
      }

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)

      onChange(canvas.toDataURL('image/jpeg', 0.95))
      closeCropSession()
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not crop image.')
    }
  }

  return (
    <div className={`form-image-upload${wide ? ' form-image-upload--wide' : ''}`}>
      <label className="form-image-upload__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="form-image-upload__controls">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="form-image-upload__file"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            setError(null)
            try {
              const dataUrl = await readFormImageAsDataUrl(file)
              const image = await loadImage(dataUrl)
              setCropSession({
                sourceUrl: dataUrl,
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
              })
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not load image.')
            }
          }}
        />
        {value ? (
          <button
            type="button"
            className="form-image-upload__clear secondary-action"
            onClick={() => {
              setError(null)
              onChange('')
            }}
          >
            Remove image
          </button>
        ) : null}
      </div>
      {value ? (
        <div className="form-image-upload__preview">
          <img src={mediaUrl(value)} alt="" />
        </div>
      ) : null}
      {error ? <p className="form-image-upload__error">{error}</p> : null}

      {cropSession ? (
        <div className="form-image-upload__crop-modal" role="dialog" aria-modal="true" aria-label={`${label} crop editor`}>
          <div className="form-image-upload__crop-backdrop" onClick={closeCropSession} />
          <div className="form-image-upload__crop-dialog">
            <div className="form-image-upload__crop-header">
              <div>
                <p className="form-image-upload__crop-kicker">Locked crop</p>
                <h3 className="form-image-upload__crop-title">{label}</h3>
              </div>
              <button type="button" className="secondary-action form-image-upload__crop-close" onClick={closeCropSession}>
                Cancel
              </button>
            </div>

            <p className="form-image-upload__crop-copy">
              Drag the image to reposition it. The frame stays locked to the page design.
            </p>

            <div
              ref={cropFrameRef}
              className="form-image-upload__crop-stage"
              style={{ width: `${stageWidth}px`, aspectRatio: String(cropAspectRatio) }}
              onPointerDown={(event) => {
                const target = event.currentTarget
                target.setPointerCapture(event.pointerId)
                dragRef.current = {
                  pointerId: event.pointerId,
                  startX: event.clientX,
                  startY: event.clientY,
                  startPosition: position,
                }
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current
                if (!drag || drag.pointerId !== event.pointerId) return
                if (!cropMetrics) return
                setPosition(
                  clampPosition(
                    {
                      x: drag.startPosition.x + (event.clientX - drag.startX),
                      y: drag.startPosition.y + (event.clientY - drag.startY),
                    },
                    stageSize,
                    cropMetrics.renderedWidth,
                    cropMetrics.renderedHeight,
                  ),
                )
              }}
              onPointerUp={(event) => {
                const drag = dragRef.current
                if (!drag || drag.pointerId !== event.pointerId) return
                dragRef.current = null
              }}
              onPointerCancel={() => {
                dragRef.current = null
              }}
            >
              {cropMetrics ? (
                <img
                  src={cropSession.sourceUrl}
                  alt="Crop preview"
                  draggable={false}
                  className="form-image-upload__crop-image"
                  style={{
                    width: `${cropMetrics.renderedWidth}px`,
                    height: `${cropMetrics.renderedHeight}px`,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                />
              ) : null}
              <div className="form-image-upload__crop-frame" />
            </div>

            <label className="form-image-upload__zoom-row">
              Zoom
              <input
                type="range"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step="0.01"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>

            <div className="form-image-upload__crop-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  if (!cropMetrics) return
                  setZoom(1)
                  setPosition(centerPosition(stageSize, cropMetrics.renderedWidth / zoom, cropMetrics.renderedHeight / zoom))
                }}
              >
                Reset crop
              </button>
              <button type="button" className="primary-action" onClick={() => void confirmCrop()}>
                Use cropped image
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
