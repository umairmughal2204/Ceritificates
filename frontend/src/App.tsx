import { useState } from 'react'
import './App.css'

const pdfOptions = [
  'Safety Spectrum London fsc',
  'Legionella',
  'Asbestos managment survey',
  'Safety Spectrum London elc',
  'fet safety spectrum london',
  'pat Safety spectrum london',
  'fdi safety spectrum london',
]

const elcPdfName = 'Safety Spectrum London elc'
const fscPdfName = 'Safety Spectrum London fsc'
const patPdfName = 'pat Safety spectrum london'
const fetPdfName = 'fet safety spectrum london'
const legionellaPdfName = 'Legionella'
const fdiPdfName = 'fdi safety spectrum london'
const asbestosPdfName = 'Asbestos managment survey'

type ElcFormData = {
  inspectionDate: string
  certificateReference: string
  postcode: string
  clientName: string
  clientAddress: string
  purposeText: string
  extentLine1: string
  extentLine2: string
  installationAddress: string
  tradingTitle: string
  contractorAddress: string
  inspectorName: string
  signedDate: string
  nextInspectionInterval: string
  notes: string[]
}

type FscMark = 'tick' | 'na' | 'blank'

type FscFormData = {
  metaDate: string
  metaReference: string
  clientName: string
  clientAddress: string
  extent: string
  limitations: string
  systemDetails: string
  systemAddress: string
  tradingTitle: string
  contractorAddress: string
  contractorName: string
  contractorPosition: string
  certDate: string
  signature: string
  variations: string
  refDoc1: string
  refDoc2: string
  nextDate: string
  deviationMarks: { mark1: FscMark; mark2: FscMark }
  condition: string
  assessment: string
  summaryMarks: { line1: FscMark; line2: FscMark; line3: FscMark; line4: FscMark }
  batteryMarks: FscMark[]
  premisesMarks: FscMark[]
  documentationMarks: FscMark[]
  falseAlarmMarks: FscMark[]
  actionDetails: string
  testedMarks: FscMark[]
  repairMarks: FscMark[]
  twelveMonthInspectionMarks: FscMark[]
  twelveMonthTestMarks: FscMark[]
  additionalMarks: FscMark[]
}

type PatRow = {
  applianceId: string
  testDate: string
  description: string
  location: string
  serialNumber: string
  retestPeriod: string
  retestDate: string
  status: string
}

type PatFormData = {
  certificateNumber: string
  clientAddress: string
  clientPostcode: string
  installationAddress: string
  installationPostcode: string
  tradingTitle: string
  contractorAddress: string
  contractorPostcode: string
  registrationNumber: string
  telephoneNumber: string
  inspectorName: string
  inspectorPosition: string
  signature: string
  certificateDate: string
  testEquipmentUsed: string
  equipmentSerialNumber: string
  rows: PatRow[]
  totalAppliances: string
}

type FetRow = {
  itemNo: string
  location: string
  make: string
  serialNumber: string
  type: string
  capacity: string
  remarks: string
  retest: string
}

type FetFormData = {
  date: string
  reference: string
  premisesName: string
  premisesAddress: string
  comments: string
  tradingTitle: string
  contractorAddress: string
  contractorName: string
  signature: string
  contractorPosition: string
  contractorDate: string
  rows: FetRow[]
}

type LegionellaFormData = {
  page1PropertyAddress: string
  page1ClientName: string
  page1AssessorName: string
  page1Reference: string
  page1AssessmentDate: string
  page1PropertyType: string
  page1DutyHolder: string
  page1ResponsiblePersons: string
  page1PolicyExists: string
  page1TrainedCompetent: string
  page1ContractorsApproved: string
  page1WrittenScheme: string
  page1SchematicSupplied: string
  page1Occupied: string
  page1CoverNote: string
  page1Location: string
  page1InspectedOn: string
  page1OurRef: string
  page1FooterCompany: string
  page5Scope: string
  page5Limitations: string
  page5SystemType: string
  page5WholesomeSupply: string
  page5FittingsSuitable: string
  page5Overview: string
  page5ControlStrategy: string
  page7PhotoUrl: string
  page8Note: string
  page9Note: string
  page14PhotoUrl: string
  page15PhotoUrl: string
  page16PhotoUrl: string
  page17PhotoUrl: string
  page17Note: string
  page23Photo1Url: string
  page23Photo2Url: string
  page23Photo3Url: string
  page23Photo4Url: string
  page25Summary: string
  page25RiskLevel: string
  page25RiskText: string
  page25ReviewDate: string
  page26Subtitle: string
  page26AssessorName: string
  page26Email: string
  page26AssessmentDate: string
  page26Copy: string
  page27SchematicUrl: string
}

type FdiFormData = {
  page1ImageUrl: string
  page2ReportBy: string
  page2Client: string
  page2ProjectSite: string
  page2Address: string
  page2MapUrl: string
  page2SiteDescription: string
  page2Technicians: string
  page2InspectionDatesQc: string
  page2Date: string
  page2TotalInspected: string
  page2TotalPassed: string
  page2TotalFailed: string
  page2FooterProject: string
  page4QcName: string
  page4QcDate: string
  page4QcSignature: string
  page4Introduction: string
  page4ExecutiveSummary: string
  page4Variations: string
  page4LimitedAccessNote: string
  page4AccessDoorRef: string
  page4AccessNotes: string
  page4AccessPage: string
  page4FooterProject: string
  page5InspectionRef: string
  page5DoorRef: string
  page5Location: string
  page5RemedialActions: string
  page5NeedsReplacing: string
  page5Page: string
  page5FooterProject: string
  page6RouteTitle: string
  page6DoorRef: string
  page6OverallStatus: string
  page6RatingSufficient: string
  page6DoorFrame: string
  page6Hinges: string
  page6Gaps: string
  page6Seals: string
  page6Closer: string
  page6Lockset: string
  page6Glazing: string
  page6Signage: string
  page6GeneralComments: string
  page6Page: string
  page6FooterProject: string
  page8OverallResult: string
  page8DoorReference: string
  page8DoorType: string
  page8Dimensions: string
  page8Material: string
  page8WallType: string
  page8GapTop: string
  page8GapLeft: string
  page8GapRight: string
  page8GapBottom: string
  page8GapMeeting: string
  page8RatingRequirement: string
  page8RatingCertified: string
  page8RatingSufficient: string
  page8Cat1Result: string
  page8Cat1Details: string
  page8Cat2Result: string
  page8Cat2Details: string
  page8Cat3Result: string
  page8Cat3Details: string
  page8Cat4Result: string
  page8Cat4Details: string
  page8Cat5Result: string
  page8Cat5Details: string
  page8Cat6Result: string
  page8Cat6Details: string
  page8Cat7Result: string
  page8Cat7Details: string
  page8Cat8Result: string
  page8Cat8Details: string
  page8HeroDoorUrl: string
  page8Photo1Url: string
  page8Photo2Url: string
  page8Photo3Url: string
  page8Photo4Url: string
  page8FooterProject: string
}

type AsbestosFieldDef = {
  key: string
  label: string
  page: 1 | 2 | 4 | 5 | 6 | 7 | 9 | 12
  wide?: boolean
}

type AsbestosFormData = Record<string, string>

const asbestosFieldDefs: AsbestosFieldDef[] = [
  { key: 'page1Location', label: 'Location', page: 1 }, { key: 'page1InspectedOn', label: 'Inspected On', page: 1 }, { key: 'page1Ref', label: 'Our Ref', page: 1 }, { key: 'page1Company', label: 'Company', page: 1 },
  { key: 'page2ReportBy', label: 'Report By', page: 2 }, { key: 'page2Client', label: 'Client', page: 2 }, { key: 'page2Project', label: 'Project', page: 2 }, { key: 'page2SiteAddress', label: 'Site Address', page: 2, wide: true }, { key: 'page2Coordinates', label: 'Site Coordinates', page: 2, wide: true }, { key: 'page2MapImageUrl', label: 'Map Image URL', page: 2, wide: true }, { key: 'page2SiteDescription', label: 'Site Description', page: 2, wide: true }, { key: 'page2Surveyors', label: 'Surveyors', page: 2 }, { key: 'page2SurveyDates', label: 'Survey Dates', page: 2 }, { key: 'page2QcDate', label: 'QC Date', page: 2 }, { key: 'page2TotalVeryLow', label: 'Total Very Low', page: 2 }, { key: 'page2TotalLow', label: 'Total Low', page: 2 }, { key: 'page2TotalMedium', label: 'Total Medium', page: 2 }, { key: 'page2TotalHigh', label: 'Total High', page: 2 }, { key: 'page2FooterProject', label: 'Footer Project Text', page: 2, wide: true },
  { key: 'page4QualityControlDate', label: 'Quality Control Date', page: 4 }, { key: 'page4SignoffParagraph', label: 'Sign Off Paragraph', page: 4, wide: true }, { key: 'page4VariationsToScope', label: 'Variations To Scope', page: 4, wide: true }, { key: 'page4SummaryAcm', label: 'Summary ACM', page: 4, wide: true }, { key: 'page4AcmTableNote', label: 'ACM Table Note', page: 4, wide: true }, { key: 'page4SummaryNonAcm', label: 'Summary Non-ACM', page: 4, wide: true }, { key: 'page4NonAcmTableNote', label: 'Non-ACM Table Note', page: 4, wide: true }, { key: 'page4FooterProject', label: 'Footer Project Text', page: 4, wide: true },
  { key: 'page5LimitedAccessCopy', label: 'Limited Access Copy', page: 5, wide: true }, { key: 'page5LimitedAccessTableNote', label: 'Limited Access Table Note', page: 5, wide: true }, { key: 'page5FooterProject', label: 'Footer Project Text', page: 5, wide: true },
  { key: 'page6RegisterNote', label: 'Register Note', page: 6, wide: true }, { key: 'page6FooterProject', label: 'Footer Project Text', page: 6, wide: true },
  { key: 'page7SummaryLine1', label: 'Summary Line 1', page: 7, wide: true }, { key: 'page7SummaryLine2', label: 'Summary Line 2', page: 7, wide: true }, { key: 'page7Row1Location', label: 'Row 1 Location', page: 7, wide: true }, { key: 'page7Row1Item', label: 'Row 1 Item', page: 7 }, { key: 'page7Row1Material', label: 'Row 1 Material', page: 7 }, { key: 'page7Row1AccessNotes', label: 'Row 1 Access/Notes', page: 7 }, { key: 'page7Row1MaterialScore', label: 'Row 1 Material Score', page: 7 }, { key: 'page7Row1Recommendation', label: 'Row 1 Recommendation', page: 7 }, { key: 'page7Row1Page', label: 'Row 1 Page', page: 7 }, { key: 'page7Row2Location', label: 'Row 2 Location', page: 7, wide: true }, { key: 'page7Row2Item', label: 'Row 2 Item', page: 7 }, { key: 'page7Row2Material', label: 'Row 2 Material', page: 7 }, { key: 'page7Row2AccessNotes', label: 'Row 2 Access/Notes', page: 7 }, { key: 'page7Row2MaterialScore', label: 'Row 2 Material Score', page: 7 }, { key: 'page7Row2Recommendation', label: 'Row 2 Recommendation', page: 7 }, { key: 'page7Row2Page', label: 'Row 2 Page', page: 7 }, { key: 'page7FooterProject', label: 'Footer Project Text', page: 7, wide: true },
  { key: 'page9Building', label: 'Building', page: 9 }, { key: 'page9Level', label: 'Level', page: 9 }, { key: 'page9Location', label: 'Location', page: 9 }, { key: 'page9Item', label: 'Item', page: 9 }, { key: 'page9PhotoUrl', label: 'Photo URL', page: 9, wide: true }, { key: 'page9SecondPhotoNote', label: 'Second Photo Note', page: 9, wide: true }, { key: 'page9LocationNotes', label: 'Location Notes', page: 9, wide: true }, { key: 'page9FooterProject', label: 'Footer Project Text', page: 9, wide: true },
  { key: 'page12IntroCopy', label: 'Intro Copy', page: 12, wide: true }, { key: 'page12OutroCopy', label: 'Outro Copy', page: 12, wide: true }, { key: 'page12FooterProject', label: 'Footer Project Text', page: 12, wide: true },
]

const asbestosDateKeys = new Set([
  'page1InspectedOn',
  'page2SurveyDates',
  'page2QcDate',
  'page4QualityControlDate',
])

const monthMap: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
}

const toCalendarValue = (value: string) => {
  if (!value) return ''
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) return value
  const longMatch = value.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/)
  if (longMatch) {
    const [, d, monthName, y] = longMatch
    const mm = monthMap[monthName.toLowerCase()]
    if (!mm) return ''
    return `${y}-${mm}-${String(d).padStart(2, '0')}`
  }
  return ''
}

const fromCalendarValue = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return value
  const [, y, m, d] = match
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[Number(m) - 1] ?? m
  return `${Number(d)} ${month} ${y}`
}

const toPdfDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return value
  }
  const [, yyyy, mm, dd] = match
  return `${dd}/${mm}/${yyyy}`
}

const defaultElcForm: ElcFormData = {
  inspectionDate: '2025-12-22',
  certificateReference: '665397',
  postcode: 'SE17 1DX',
  clientName: 'City Relay',
  clientAddress: '1, 1 Townley Street and Elephant Houses SE17 1DX',
  purposeText: 'To certify continued compliance of an existing installation',
  extentLine1: '> 75 Emergency Lights Tested',
  extentLine2: 'All the Emergency Lights are working fine',
  installationAddress: '1, 1 Townley Street and Elephant Houses SE17 1DX',
  tradingTitle: 'Safety Spectrum London',
  contractorAddress: '58A Tudor Road Hayes UB3 2QD',
  inspectorName: 'Shahzil Pal',
  signedDate: '2025-12-22',
  nextInspectionInterval: '6 Months',
  notes: [
    '1 emergency light present in main entrance',
    '1 emergency light present in kitchen',
    '1 emergency light present in living area',
    '2 emergency lights present in second floor',
    '3 emergency lights present in third floor',
  ],
}

const PREMISES_LABELS = [
  'Manual call points suitably sited',
  'Manual call points suitably unobstructed',
  'Manual call points conspicuous',
  'All exits, including new exits have manual call points',
  'Automatic fire detectors suitable for building use or occupancy',
  'Automatic fire detectors suitably sited',
  'Fire alarm devices suitably sited',
  'No partitions within 500mm horizontally of any automatic fire detector',
  'No storage within 300mm of ceilings',
  'Clear space of 500mm exists below each automatic fire detector',
  'Each automatic fire detectors ability to receive the stimulus not impeded',
  'Building use or occupancy does not make detectors unsuitable',
  'Additional fire detection provided in extensions/alterations',
]

const TESTED_LABELS = [
  'Fire alarm functions of CIE checked by operation of detector/call point',
  'Operation of fire alarm devices',
  'Controls and visual indicators at CIE checked',
  'Ancillary functions of CIE tested',
  'For CIE, manufacturers checks and tests performed',
  'Fault indicators and circuits checked by simulation of fault',
  'Automatic transmission of alarm signal to receiving centre',
  'Automatic transmission of other signals to receiving centre',
  'Radio systems serviced per manufacturer',
  'For other equipment, manufacturer\'s checks performed',
  'Printers checked for correct operation',
  'Printers checked that characters are legible',
  'Print consumables available in sufficient quantities',
  'Standby battery disconnected and full load alarm simulated',
  'Specific gravity of each cell of vented batteries checked',
  'Mains disconnected and batteries momentarily load tested',
]

const REPAIR_LABELS = [
  'Emergency call out arrangement in place (third party)',
  'Name and telephone of third party at main CIE',
  'Records and documentation give maintenance info',
  'User records faults or damage in log book',
  'User arranges for repairs as soon as possible',
]

const INSP12_LABELS = [
  'Automatic fire detectors unpainted',
  'Automatic fire detectors undamaged',
  'Ancillary functions of CIE tested',
  'Visual fire alarm devices not obstructed',
  'Lenses of visual fire alarm devices are clean',
  'Readily-accessible cable fixings secure',
  'Readily-accessible cable fixings undamaged',
  'Cause and effect programme confirmed correct',
]

const TEST12_LABELS = [
  'Switch mechanism of every manual call point',
  'Fire alarm devices checked for correct operation',
  'Automatic fire detectors functionally tested',
  'All unmonitored permanently-illuminated lamps replaced',
  'CIE manufacturer\'s annual checks and tests carried out',
  'Radio signal strengths checked for adequacy',
  'Analogue values within manufacturer range',
  'Standby power supply capacity checked',
  'Manufacturer recommended checks for other components',
]

const ADDITIONAL_LABELS = [
  'Adequate number of call points (Clause 20.2)',
  'Adequate provision of fire detection for category',
  'Sound pressure levels comply with Clause 16.2',
  'Changes in use, layout or construction not reduced effectiveness',
  'Cabling has fire resistance complying with Clause 26.2',
  'Circuits monitored in compliance with Clause 12.2',
  'Requirements of BS 7671 are met (Clause 29)',
  'Standby power supplied provided',
  'Standby power supplies comply with Clause 25.4',
  'Exposure to false alarms is not excessive',
  'Existing records checked',
  'Log book available',
]

const defaultFscForm: FscFormData = {
  metaDate: '2026-04-13',
  metaReference: '894930988 SE1 9NX',
  clientName: 'Duc Nguyen',
  clientAddress: 'Apartment C1602, NEO Bankside, 70 Holland Street, London, SE1 9NX',
  extent: 'Grade D LD fire detection automatic system',
  limitations: 'N/A',
  systemDetails:
    "1 alarm present in kitchen\n1 alarm present in hallway\nAlarms lights are on but they didn't make sound",
  systemAddress: 'Apartment C1602, NEO Bankside, 70 Holland Street, London, SE1 9NX',
  tradingTitle: 'Safety Spectrum London',
  contractorAddress: '58A Tudor Road Hayes UB3 2QD',
  contractorName: 'Mushtaq Khan',
  contractorPosition: 'Qualified Supervisor',
  certDate: '2026-04-13',
  signature: 'Jh',
  variations: 'N/A',
  refDoc1: '',
  refDoc2: '',
  nextDate: '2026-10-13',
  deviationMarks: { mark1: 'na', mark2: 'na' },
  condition: 'Good Condition',
  assessment: 'SATISFACTORY',
  summaryMarks: { line1: 'na', line2: 'na', line3: 'na', line4: 'na' },
  batteryMarks: ['tick', 'tick', 'na'],
  premisesMarks: Array(13).fill('tick') as FscMark[],
  documentationMarks: ['na', 'na'],
  falseAlarmMarks: ['na', 'na', 'na'],
  actionDetails: '',
  testedMarks: [
    'tick', 'tick', 'na', 'na', 'na', 'tick', 'na', 'na',
    'na', 'na', 'na', 'na', 'na', 'tick', 'na', 'tick',
  ],
  repairMarks: ['na', 'na', 'na', 'na', 'na'],
  twelveMonthInspectionMarks: ['tick', 'tick', 'na', 'tick', 'na', 'tick', 'tick', 'na'],
  twelveMonthTestMarks: ['tick', 'tick', 'tick', 'na', 'na', 'tick', 'tick', 'tick', 'na'],
  additionalMarks: ['tick', 'tick', 'tick', 'tick', 'tick', 'tick', 'tick', 'tick', 'tick', 'tick', 'na', 'na'],
}

const defaultPatForm: PatFormData = {
  certificateNumber: '255045',
  clientAddress: 'Glets,5 Quadrant Rd, Croydon',
  clientPostcode: 'CR7 7DB',
  installationAddress: 'Glets,5 Quadrant Rd, Croydon',
  installationPostcode: 'CR7 7DB',
  tradingTitle: 'Safety Spectrum London',
  contractorAddress: '58A Tudor Road Hayes UB3 2QD',
  contractorPostcode: 'UB3 2QD',
  registrationNumber: '16678881',
  telephoneNumber: '+44 20 4628 6504',
  inspectorName: 'Giorgio Demetriou',
  inspectorPosition: 'Qualified Supervisor',
  signature: 'GDemetriou',
  certificateDate: '2025-12-17',
  testEquipmentUsed: 'Megger PAT4 Dv3',
  equipmentSerialNumber: '7812',
  rows: [
    {
      applianceId: '00001',
      testDate: '2025-12-17',
      description: 'Washing machine 1',
      location: 'Kitchen',
      serialNumber: '',
      retestPeriod: '12',
      retestDate: '2026-12-17',
      status: 'Pass',
    },
    {
      applianceId: '00002',
      testDate: '2025-12-17',
      description: 'Washing machine 2',
      location: 'Kitchen',
      serialNumber: '',
      retestPeriod: '12',
      retestDate: '2026-12-17',
      status: 'Fail',
    },
    {
      applianceId: '00003',
      testDate: '2025-12-17',
      description: 'Microwave',
      location: 'Kitchen',
      serialNumber: '',
      retestPeriod: '12',
      retestDate: '2026-12-17',
      status: 'Pass',
    },
    {
      applianceId: '00004',
      testDate: '2025-12-17',
      description: 'Stove',
      location: 'Kitchen',
      serialNumber: '',
      retestPeriod: '12',
      retestDate: '2026-12-17',
      status: 'Pass',
    },
  ],
  totalAppliances: 'Total Appliances for Report: 4',
}

const defaultFetForm: FetFormData = {
  date: '2026-02-18',
  reference: '81773182 SW9 8SE',
  premisesName: 'GLETS',
  premisesAddress: 'Basement, F318 Coldharbour Lne, Lambeth, SW9 8SE',
  comments: 'N/A',
  tradingTitle: 'Safety Spectrum London',
  contractorAddress: '14 Serbert\nRoad, London\nE7 0NQ',
  contractorName: 'G. Stewart',
  signature: '',
  contractorPosition: 'Engineer',
  contractorDate: '2026-02-18',
  rows: [
    {
      itemNo: '1',
      location: 'Kitchen',
      make: 'sentinel',
      serialNumber: 'N/A',
      type: 'Co2',
      capacity: '2 litre',
      remarks: 'Good condition',
      retest: '2027-02-18',
    },
    {
      itemNo: '2',
      location: 'Near main door',
      make: 'fire cheif',
      serialNumber: 'N/A',
      type: 'Foam',
      capacity: '6 litre',
      remarks: 'Good condition',
      retest: '2027-02-18',
    },
  ],
}

const defaultLegionellaForm: LegionellaFormData = {
  page1PropertyAddress: '13 Tudor Road , LU3 1RN',
  page1ClientName: 'Arete Health Limited',
  page1AssessorName: 'Mr. Muhammad Faizan',
  page1Reference: '000455',
  page1AssessmentDate: '2026-01-12',
  page1PropertyType: 'House',
  page1DutyHolder: 'Arete Health Limited',
  page1ResponsiblePersons: 'Arete Health Limited',
  page1PolicyExists: 'Unknown',
  page1TrainedCompetent: 'Unknown',
  page1ContractorsApproved: 'Unknown',
  page1WrittenScheme: 'Unknown',
  page1SchematicSupplied: '*No',
  page1Occupied: '*No',
  page1CoverNote:
    "*Please note that if the property is not occupied at time of inspection it is not possible to assess the risk of persons who may be vulnerable to Legionnaire's Disease. Therefore, the assessment will require review once the property is occupied. Properties which are unoccupied for periods of 2 weeks or more present a risk due to water stagnation- further details are contained in section 8 of this assessment.",
  page1Location: '14 Sebert Road,\nLondon, E7 0NQ',
  page1InspectedOn: '12-Jan-2026',
  page1OurRef: 'P000455',
  page1FooterCompany: 'Safety Spectrum London',
  page5Scope: '13 Tudor Road , LU3 1RN',
  page5Limitations: '',
  page5SystemType: 'Mains-fed cold water supply Hot water is provided via a combi boiler.',
  page5WholesomeSupply: 'Yes',
  page5FittingsSuitable: 'Yes',
  page5Overview:
    'The property is supplied by a standard domestic hot and cold water system. Hot water is generated via a combi boiler (no stored hot water cylinder present), meaning water is heated on demand and not stored, reducing Legionella risk. The system distributes hot and cold water to the kitchen, bathroom, and any additional hand basins present within the property.',
  page5ControlStrategy: '',
  page7PhotoUrl: '',
  page8Note: '',
  page9Note:
    'Water temperature- control measures: Ensure boiler/water heater is set to 60°C so that water reaches outlets at above 50°C. Ensure cold water does not exceed 20°C by making sure pipes and storage tanks are insulated. Ensure water temperature at outlets is 39-43°C where TMVs are fitted, or above 50°C at the hot pipe feeding the TMV if it is accessible. TMVs should be tested at least annually.',
  page14PhotoUrl: '',
  page15PhotoUrl: '',
  page16PhotoUrl: '',
  page17PhotoUrl: '',
  page17Note:
    'showers/spray/taps/hose pipes should be flushed through weekly. Shower heads and other outlets should be de-scaled at least every 3-6 months. Consideration should be given to replacing spray taps with normal taps.',
  page23Photo1Url: '',
  page23Photo2Url: '',
  page23Photo3Url: '',
  page23Photo4Url: '',
  page25Summary: '',
  page25RiskLevel: 'Risk level 1',
  page25RiskText: ' - Minor',
  page25ReviewDate: '08/12/2027',
  page26Subtitle: "Legionella Risk Assessment For\n39 St Luke's Street, London,  SW3 3RP",
  page26AssessorName: 'Mr. Muhammad Faizan',
  page26Email: 'info@safetyspectrumlondon.co.uk',
  page26AssessmentDate: '08/12/2025',
  page26Copy:
    'This Legionella risk assessment has been produced by a competent assessor in accordance with the requirements of Approved Code of Practice L8, HSG 274 Part 2 and other relevant HSE guidance. If you have any queries with this certificate please contact the assessor that produced it in the first instance, their details are shown above.',
  page27SchematicUrl: '',
}

const defaultFdiForm: FdiFormData = {
  page1ImageUrl: '/src/assets/1.png',
  page2ReportBy: 'Safety Spectrum London',
  page2Client: 'Christianah',
  page2ProjectSite: 'P.5657668529',
  page2Address: '7 Gurney close  E15 1SJ',
  page2MapUrl: '',
  page2SiteDescription: 'Inspection carried out for main flat door.',
  page2Technicians: 'Muhammad Khokhar',
  page2InspectionDatesQc: '13 March 2026',
  page2Date: '13 March 2026',
  page2TotalInspected: '1',
  page2TotalPassed: '1',
  page2TotalFailed: '0',
  page2FooterProject: 'Safety Spectrum London > Project: P.5657668529',
  page4QcName: 'Muhammad Khokhar',
  page4QcDate: '13 March 2026',
  page4QcSignature: 'M. Khokhar',
  page4Introduction: 'Safety Spectrum London was instructed to undertake a fire door condition inspection of the selected doors within the property. The inspection reviewed the visible condition of each door assembly and recorded whether the observed elements appeared suitable based on the inspection criteria used during the survey.',
  page4ExecutiveSummary: '',
  page4Variations: 'All areas within scope were accessed during the survey',
  page4LimitedAccessNote: 'These areas could not be fully accessed during survey.',
  page4AccessDoorRef: '',
  page4AccessNotes: 'all locations and doors were fully accessed',
  page4AccessPage: '',
  page4FooterProject: 'Safety Spectrum London > Project: P.5657668529',
  page5InspectionRef: 'inspection details (p. 0)',
  page5DoorRef: 'Door 1',
  page5Location: 'Main Flat / 0 / Main Flat door',
  page5RemedialActions: '<em>please see inspection details</em>',
  page5NeedsReplacing: 'No',
  page5Page: '8',
  page5FooterProject: 'Safety Spectrum London > Project: P.5657668529',
  page6RouteTitle: 'Main Flat > Main Flat Door',
  page6DoorRef: 'Door 1',
  page6OverallStatus: 'PASS',
  page6RatingSufficient: 'YES✓',
  page6DoorFrame: 'PASS',
  page6Hinges: 'PASS',
  page6Gaps: 'PASS',
  page6Seals: 'PASS',
  page6Closer: 'PASS',
  page6Lockset: 'PASS',
  page6Glazing: 'N/A',
  page6Signage: 'N/A',
  page6GeneralComments: '',
  page6Page: '8',
  page6FooterProject: 'Safety Spectrum London > Project: P.5657668529',
  page8OverallResult: 'Pass',
  page8DoorReference: 'Door 1',
  page8DoorType: 'FD30',
  page8Dimensions: 'Door 1: 838mm x 1975mm x 47mm',
  page8Material: 'Door:Timber /Frame:Timber',
  page8WallType: 'Solid brickwork',
  page8GapTop: '2mm',
  page8GapLeft: '1mm',
  page8GapRight: '2mm',
  page8GapBottom: '2mm',
  page8GapMeeting: '0mm',
  page8RatingRequirement: 'FD30',
  page8RatingCertified: 'Yes',
  page8RatingSufficient: 'Yes',
  page8Cat1Result: 'Pass',
  page8Cat1Details: 'Satisfactory condition of Frame. Door is of 47mm in thickness.',
  page8Cat2Result: 'Pass',
  page8Cat2Details: 'Satisfactory. 3 fire rated hinges present.',
  page8Cat3Result: 'Pass',
  page8Cat3Details: 'Gap around the door is acceptable. Each side not more than 4mm.',
  page8Cat4Result: 'Pass',
  page8Cat4Details: 'Intumescent strips and smoke seals in satisfactory condition installed.',
  page8Cat5Result: 'Pass',
  page8Cat5Details: 'Inner chain door closer present.',
  page8Cat6Result: 'Pass',
  page8Cat6Details: 'Latch/Handle is fitted in the correct location.',
  page8Cat7Result: 'N/A',
  page8Cat7Details: '',
  page8Cat8Result: 'N/A',
  page8Cat8Details: '',
  page8HeroDoorUrl: '',
  page8Photo1Url: '',
  page8Photo2Url: '',
  page8Photo3Url: '',
  page8Photo4Url: '',
  page8FooterProject: 'Safety Spectrum London > Project: P.5657668529',
}

const defaultAsbestosForm: AsbestosFormData = {
  ...Object.fromEntries(asbestosFieldDefs.map((field) => [field.key, ''])),
  page1Location: 'London, UK',
  page1InspectedOn: '12 Dec 2025',
  page1Ref: 'P.2724',
  page1Company: 'Safety Spectrum London',
  page2ReportBy: 'Safety Spectrum London',
  page2Client: 'Timothy Denman and Lucy Haigh',
  page2Project: 'P.2724',
  page2SiteAddress: '4A Hainault Rd E11 1EE',
  page2Coordinates: '51.56768953733295, -0.008614870475309063',
  page2MapImageUrl: '/src/assets/2.png',
  page2SiteDescription: 'Its a Residential property built on solid brick wall',
  page2Surveyors: 'Muhammad Khokhar',
  page2SurveyDates: '12th December 2025',
  page2QcDate: '18th December 2025',
  page2TotalVeryLow: '0',
  page2TotalLow: '0',
  page2TotalMedium: '0',
  page2TotalHigh: '0',
  page2FooterProject: 'Safety Spectrum London > Project: P2724',
  page4QualityControlDate: '18th December 2025',
  page4SignoffParagraph:
    'This survey was conducted in accordance with HSG 264 (Asbestos: The Survey Guide). Landlord Certify cannot accept any liability for loss, injury, damage or penalty issues that arise for reasons of survey scope limitations. Landlord Certify cannot be held responsible for asbestos potentially present in areas of the building not explicitly specified within the client instruction, not indicated on provided site plans or not physically possible to access. Landlord Certify cannot be held responsible for any damage caused as part of this survey carried out on your behalf. Due to the nature and necessity of sampling for asbestos some damage is unavoidable and will be limited to that necessary for taking of the samples.',
  page4VariationsToScope: 'All areas within scope were accessed during the survey',
  page4SummaryAcm: 'These suspected materials were assessed as asbestos-containing.',
  page4AcmTableNote: 'nothing to show',
  page4SummaryNonAcm: 'These suspected materials were assessed as non-asbestos-containing.',
  page4NonAcmTableNote: 'nothing to show',
  page4FooterProject: 'Safety Spectrum London > Project: P2724',
  page5LimitedAccessCopy:
    'These locations or items could not be fully accessed during survey. Asbestos should be presumed to be present until a further assessment can be undertaken. Note that the survey scope may exclude other areas - see Report Details (p. 2) and Variations to Scope (p. 4).',
  page5LimitedAccessTableNote: 'all locations and items were fully accessed',
  page5FooterProject: 'Safety Spectrum London > Project: P2724',
  page6RegisterNote: 'n/a',
  page6FooterProject: 'Safety Spectrum London > Project: P2724',
  page7SummaryLine1: 'A summary of all locations and items inspected during the survey, including ACMs,',
  page7SummaryLine2: 'non ACMs and items & locations that could not be fully accessed.',
  page7Row1Location: 'Main Building / 0 / Communal Hallway',
  page7Row1Item: 'Solid Painted Cement Wall',
  page7Row1Page: '9',
  page7Row2Location: 'Main Building / 0 / Hallway',
  page7Row2Item: 'Textured Coating',
  page7Row2Page: '9',
  page7FooterProject: 'Safety Spectrum London > Project: P2724',
  page9Building: 'Main Building',
  page9Level: '0',
  page9Location: 'Communal Hallway',
  page9PhotoUrl: '/src/assets/9.png',
  page9LocationNotes: 'Solid Painted Cement Wall',
  page9FooterProject: 'Safety Spectrum London > Project: P2724',
  page12IntroCopy:
    'Where ACMs have been identified or presumed, a material score is calculated in accordance with HSG 264 (Asbestos: The Survey Guide). The value assigned to each of the four sample variables is added together to give a total material score between 2 and 12.',
  page12OutroCopy:
    'The material score determines the potential for a material to release asbestos fibres when disturbed. This score is then categorised to describe the potential:',
  page12FooterProject: 'Safety Spectrum London > Project: P2724',
}

function MarkSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: FscMark
  onChange: (v: FscMark) => void
}) {
  return (
    <label className="wide">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value as FscMark)}>
        <option value="tick">Tick (✓)</option>
        <option value="na">N/A</option>
        <option value="blank">Blank</option>
      </select>
    </label>
  )
}

function App() {
  const [activeView, setActiveView] = useState<'home' | 'elc-form' | 'fsc-form' | 'pat-form' | 'fet-form' | 'legionella-form' | 'fdi-form' | 'asbestos-form'>('home')
  const [selectedPdf, setSelectedPdf] = useState(pdfOptions[0])
  const [activeSection, setActiveSection] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [form, setForm] = useState<ElcFormData>(defaultElcForm)
  const [fscForm, setFscForm] = useState<FscFormData>(defaultFscForm)
  const [patForm, setPatForm] = useState<PatFormData>(defaultPatForm)
  const [fetForm, setFetForm] = useState<FetFormData>(defaultFetForm)
  const [legionellaForm, setLegionellaForm] = useState<LegionellaFormData>(defaultLegionellaForm)
  const [fdiForm, setFdiForm] = useState<FdiFormData>(defaultFdiForm)
  const [asbestosForm, setAsbestosForm] = useState<AsbestosFormData>(defaultAsbestosForm)

  const openSelectedLayout = () => {
    if (selectedPdf === elcPdfName) {
      setActiveSection(0)
      setActiveView('elc-form')
      return
    }
    if (selectedPdf === fscPdfName) {
      setActiveSection(0)
      setActiveView('fsc-form')
      return
    }
    if (selectedPdf === patPdfName) {
      setActiveSection(0)
      setActiveView('pat-form')
      return
    }
    if (selectedPdf === fetPdfName) {
      setActiveSection(0)
      setActiveView('fet-form')
      return
    }
    if (selectedPdf === legionellaPdfName) {
      setActiveSection(0)
      setActiveView('legionella-form')
      return
    }
    if (selectedPdf === fdiPdfName) {
      setActiveSection(0)
      setActiveView('fdi-form')
      return
    }
    if (selectedPdf === asbestosPdfName) {
      setActiveSection(0)
      setActiveView('asbestos-form')
      return
    }
    window.alert('Layout is currently available only for FSC, PAT, FET, Legionella, FDI, Asbestos and ELC certificates.')
  }

  const updateField = (field: keyof ElcFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateNote = (index: number, value: string) => {
    setForm((current) => {
      const next = [...current.notes]
      next[index] = value
      return { ...current, notes: next }
    })
  }

  const downloadElcPdf = async () => {
    const payload = {
      inspectionDate: toPdfDate(form.inspectionDate),
      certificateReference: form.certificateReference,
      postcode: form.postcode,
      clientName: form.clientName,
      clientAddress: form.clientAddress,
      purposeText: form.purposeText,
      extentLine1: form.extentLine1,
      extentLine2: form.extentLine2,
      installationAddress: form.installationAddress,
      tradingTitle: form.tradingTitle,
      contractorAddress: form.contractorAddress,
      inspectorName: form.inspectorName,
      signedDate: toPdfDate(form.signedDate),
      nextInspectionInterval: form.nextInspectionInterval,
      notes: form.notes,
    }

    setIsGenerating(true)
    localStorage.setItem('elc_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-elc.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updateFscField = <K extends keyof FscFormData>(field: K, value: FscFormData[K]) => {
    setFscForm((current) => ({ ...current, [field]: value }))
  }

  const updateFscMarkArray = (
    field:
      | 'batteryMarks'
      | 'premisesMarks'
      | 'documentationMarks'
      | 'falseAlarmMarks'
      | 'testedMarks'
      | 'repairMarks'
      | 'twelveMonthInspectionMarks'
      | 'twelveMonthTestMarks'
      | 'additionalMarks',
    index: number,
    value: FscMark,
  ) => {
    setFscForm((current) => {
      const next = [...current[field]]
      next[index] = value
      return { ...current, [field]: next }
    })
  }

  const downloadFscPdf = () => {
    const payload = {
      ...fscForm,
      metaDate: toPdfDate(fscForm.metaDate),
      certDate: toPdfDate(fscForm.certDate),
      nextDate: toPdfDate(fscForm.nextDate),
    }
    setIsGenerating(true)
    localStorage.setItem('fsc_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-fsc.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updatePatField = <K extends keyof PatFormData>(field: K, value: PatFormData[K]) => {
    setPatForm((current) => ({ ...current, [field]: value }))
  }

  const updatePatRow = (index: number, field: keyof PatRow, value: string) => {
    setPatForm((current) => {
      const next = current.rows.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
      return { ...current, rows: next }
    })
  }

  const addPatRow = () => {
    setPatForm((current) => ({
      ...current,
      rows: [
        ...current.rows,
        {
          applianceId: '',
          testDate: current.certificateDate,
          description: '',
          location: '',
          serialNumber: '',
          retestPeriod: '12',
          retestDate: current.certificateDate,
          status: '',
        },
      ],
    }))
  }

  const downloadPatPdf = () => {
    const rowsCount = patForm.rows.filter(
      (row) => row.applianceId.trim() || row.description.trim() || row.location.trim(),
    ).length
    const payload = {
      ...patForm,
      certificateDate: toPdfDate(patForm.certificateDate),
      rows: patForm.rows.map((row) => ({
        ...row,
        testDate: toPdfDate(row.testDate),
        retestDate: toPdfDate(row.retestDate),
      })),
      totalAppliances: `Total Appliances for Report: ${rowsCount}`,
    }
    setIsGenerating(true)
    localStorage.setItem('pat_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-pat.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updateFetField = <K extends keyof FetFormData>(field: K, value: FetFormData[K]) => {
    setFetForm((current) => ({ ...current, [field]: value }))
  }

  const updateFetRow = (index: number, field: keyof FetRow, value: string) => {
    setFetForm((current) => {
      const next = current.rows.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
      return { ...current, rows: next }
    })
  }

  const addFetRow = () => {
    setFetForm((current) => ({
      ...current,
      rows: [
        ...current.rows,
        {
          itemNo: String(current.rows.length + 1),
          location: '',
          make: '',
          serialNumber: '',
          type: '',
          capacity: '',
          remarks: '',
          retest: current.contractorDate,
        },
      ],
    }))
  }

  const downloadFetPdf = () => {
    const payload = {
      ...fetForm,
      date: toPdfDate(fetForm.date),
      contractorDate: toPdfDate(fetForm.contractorDate),
      rows: fetForm.rows.map((row) => ({
        ...row,
        retest: toPdfDate(row.retest),
      })),
    }
    setIsGenerating(true)
    localStorage.setItem('fet_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-fet.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updateLegionellaField = <K extends keyof LegionellaFormData>(field: K, value: LegionellaFormData[K]) => {
    setLegionellaForm((current) => ({ ...current, [field]: value }))
  }

  const downloadLegionellaPdf = () => {
    const payload = {
      ...legionellaForm,
      page1AssessmentDate: toPdfDate(legionellaForm.page1AssessmentDate),
    }
    setIsGenerating(true)
    localStorage.setItem('legionella_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-legionella.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updateFdiField = <K extends keyof FdiFormData>(field: K, value: FdiFormData[K]) => {
    setFdiForm((current) => ({ ...current, [field]: value }))
  }

  const downloadFdiPdf = () => {
    const payload = { ...fdiForm }
    setIsGenerating(true)
    localStorage.setItem('fdi_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-fdi.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  const updateAsbestosField = (field: string, value: string) => {
    setAsbestosForm((current) => ({ ...current, [field]: value }))
  }

  const downloadAsbestosPdf = () => {
    const payload = { ...asbestosForm }
    setIsGenerating(true)
    localStorage.setItem('asbestos_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-asbestos-managment-survey.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  if (activeView === 'elc-form') {
    const sections = ['Page 1: Main details', 'Page 1: Certification', 'Page 3: Notes', 'Review']
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">ELC 4-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Fill page 1 and page 3 fields, then download the completed PDF.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label>Inspection Date<input type="date" value={form.inspectionDate} onChange={(e) => updateField('inspectionDate', e.target.value)} /></label>
              <label>Certificate Reference<input value={form.certificateReference} onChange={(e) => updateField('certificateReference', e.target.value)} /></label>
              <label>Postcode<input value={form.postcode} onChange={(e) => updateField('postcode', e.target.value)} /></label>
              <label>Client Name<input value={form.clientName} onChange={(e) => updateField('clientName', e.target.value)} /></label>
              <label className="wide">Client Address<input value={form.clientAddress} onChange={(e) => updateField('clientAddress', e.target.value)} /></label>
              <label className="wide">Purpose of Certificate<input value={form.purposeText} onChange={(e) => updateField('purposeText', e.target.value)} /></label>
              <label className="wide">Extent Line 1<input value={form.extentLine1} onChange={(e) => updateField('extentLine1', e.target.value)} /></label>
              <label className="wide">Extent Line 2<input value={form.extentLine2} onChange={(e) => updateField('extentLine2', e.target.value)} /></label>
              <label className="wide">Installation Address<input value={form.installationAddress} onChange={(e) => updateField('installationAddress', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label>Trading Title<input value={form.tradingTitle} onChange={(e) => updateField('tradingTitle', e.target.value)} /></label>
              <label>Inspector Name<input value={form.inspectorName} onChange={(e) => updateField('inspectorName', e.target.value)} /></label>
              <label className="wide">Contractor Address<input value={form.contractorAddress} onChange={(e) => updateField('contractorAddress', e.target.value)} /></label>
              <label>Signed Date<input type="date" value={form.signedDate} onChange={(e) => updateField('signedDate', e.target.value)} /></label>
              <label>Next Inspection Interval<input value={form.nextInspectionInterval} onChange={(e) => updateField('nextInspectionInterval', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="appliance-table">
              <h3>Page 3 notes</h3>
              {form.notes.map((value, idx) => (
                <label key={`note-${idx}`}>
                  Note {idx + 1}
                  <input value={value} onChange={(e) => updateNote(idx, e.target.value)} />
                </label>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="review-card">
              <p>Client: <strong>{form.clientName}</strong></p>
              <p>Reference: <strong>{form.certificateReference}</strong></p>
              <p>Notes filled: <strong>{form.notes.filter((n) => n.trim()).length}</strong></p>
              <button type="button" className="primary-action" onClick={downloadElcPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled PDF'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadElcPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled PDF') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'fsc-form') {
    const sections = [
      'Page 1: Client & system',
      'Page 1: Contractor & next inspection',
      'Page 2: Deviations',
      'Page 3: Summary',
      'Page 3: Inspections schedule',
      'Page 4: Items tested & repairs',
      'Page 4: 12-month schedules',
      'Page 5: Additional checks',
      'Review',
    ]
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">FSC 5-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Every field maps to the certificate. Data replaces template values before download.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label>Date<input type="date" value={fscForm.metaDate} onChange={(e) => updateFscField('metaDate', e.target.value)} /></label>
              <label className="wide">Certificate Reference<input value={fscForm.metaReference} onChange={(e) => updateFscField('metaReference', e.target.value)} /></label>
              <label>Client Name<input value={fscForm.clientName} onChange={(e) => updateFscField('clientName', e.target.value)} /></label>
              <label className="wide">Client Address<input value={fscForm.clientAddress} onChange={(e) => updateFscField('clientAddress', e.target.value)} /></label>
              <label className="wide">Extent of installation<input value={fscForm.extent} onChange={(e) => updateFscField('extent', e.target.value)} /></label>
              <label className="wide">Limitations<input value={fscForm.limitations} onChange={(e) => updateFscField('limitations', e.target.value)} /></label>
              <label className="wide">Details of system (lines separated by Enter)
                <textarea
                  rows={3}
                  value={fscForm.systemDetails}
                  onChange={(e) => updateFscField('systemDetails', e.target.value)}
                />
              </label>
              <label className="wide">System Address<input value={fscForm.systemAddress} onChange={(e) => updateFscField('systemAddress', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label>Trading Title<input value={fscForm.tradingTitle} onChange={(e) => updateFscField('tradingTitle', e.target.value)} /></label>
              <label className="wide">Contractor Address<input value={fscForm.contractorAddress} onChange={(e) => updateFscField('contractorAddress', e.target.value)} /></label>
              <label>Name<input value={fscForm.contractorName} onChange={(e) => updateFscField('contractorName', e.target.value)} /></label>
              <label>Position<input value={fscForm.contractorPosition} onChange={(e) => updateFscField('contractorPosition', e.target.value)} /></label>
              <label>Cert Date<input type="date" value={fscForm.certDate} onChange={(e) => updateFscField('certDate', e.target.value)} /></label>
              <label>Signature<input value={fscForm.signature} onChange={(e) => updateFscField('signature', e.target.value)} /></label>
              <label className="wide">Variations<input value={fscForm.variations} onChange={(e) => updateFscField('variations', e.target.value)} /></label>
              <label className="wide">Related Reference Document 1<input value={fscForm.refDoc1} onChange={(e) => updateFscField('refDoc1', e.target.value)} /></label>
              <label className="wide">Related Reference Document 2<input value={fscForm.refDoc2} onChange={(e) => updateFscField('refDoc2', e.target.value)} /></label>
              <label>Next Inspection Date<input type="date" value={fscForm.nextDate} onChange={(e) => updateFscField('nextDate', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="form-grid">
              <MarkSelect
                label="No remedial action is required"
                value={fscForm.deviationMarks.mark1}
                onChange={(v) => updateFscField('deviationMarks', { ...fscForm.deviationMarks, mark1: v })}
              />
              <MarkSelect
                label="The following observations are made"
                value={fscForm.deviationMarks.mark2}
                onChange={(v) => updateFscField('deviationMarks', { ...fscForm.deviationMarks, mark2: v })}
              />
            </div>
          )}

          {activeSection === 3 && (
            <div className="form-grid">
              <label className="wide">General condition<input value={fscForm.condition} onChange={(e) => updateFscField('condition', e.target.value)} /></label>
              <label className="wide">Overall Assessment<input value={fscForm.assessment} onChange={(e) => updateFscField('assessment', e.target.value)} /></label>
              <MarkSelect
                label="Outstanding defects reported to responsible person"
                value={fscForm.summaryMarks.line1}
                onChange={(v) => updateFscField('summaryMarks', { ...fscForm.summaryMarks, line1: v })}
              />
              <MarkSelect
                label="Work / faults entered in log book (clause 40.2)"
                value={fscForm.summaryMarks.line2}
                onChange={(v) => updateFscField('summaryMarks', { ...fscForm.summaryMarks, line2: v })}
              />
              <MarkSelect
                label="False alarms occurred (past 12 months)"
                value={fscForm.summaryMarks.line3}
                onChange={(v) => updateFscField('summaryMarks', { ...fscForm.summaryMarks, line3: v })}
              />
              <MarkSelect
                label="Rate of false alarms per 100 detectors"
                value={fscForm.summaryMarks.line4}
                onChange={(v) => updateFscField('summaryMarks', { ...fscForm.summaryMarks, line4: v })}
              />
            </div>
          )}

          {activeSection === 4 && (
            <div className="form-grid">
              <h3 className="wide">Quarterly inspection of vented batteries</h3>
              {(['Batteries checked', 'Battery connections checked', 'Electrolyte levels checked'] as string[]).map((label, idx) => (
                <MarkSelect
                  key={`battery-${idx}`}
                  label={label}
                  value={fscForm.batteryMarks[idx]}
                  onChange={(v) => updateFscMarkArray('batteryMarks', idx, v)}
                />
              ))}
              <h3 className="wide">Premises (13 items)</h3>
              {PREMISES_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`premises-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.premisesMarks[idx]}
                  onChange={(v) => updateFscMarkArray('premisesMarks', idx, v)}
                />
              ))}
              <h3 className="wide">Documentation</h3>
              {(['System log book examined', 'Faults attended to'] as string[]).map((label, idx) => (
                <MarkSelect
                  key={`doc-${idx}`}
                  label={label}
                  value={fscForm.documentationMarks[idx]}
                  onChange={(v) => updateFscMarkArray('documentationMarks', idx, v)}
                />
              ))}
              <h3 className="wide">False alarms</h3>
              {(['Record of false alarms (Clause 30.2i)', 'Action taken complies (Clause 30.2j)', 'Rate during previous 12 months'] as string[]).map((label, idx) => (
                <MarkSelect
                  key={`false-${idx}`}
                  label={label}
                  value={fscForm.falseAlarmMarks[idx]}
                  onChange={(v) => updateFscMarkArray('falseAlarmMarks', idx, v)}
                />
              ))}
              <label className="wide">Details of action taken (free text)
                <textarea rows={3} value={fscForm.actionDetails} onChange={(e) => updateFscField('actionDetails', e.target.value)} />
              </label>
            </div>
          )}

          {activeSection === 5 && (
            <div className="form-grid">
              <h3 className="wide">Schedule of items tested (16 items)</h3>
              {TESTED_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`tested-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.testedMarks[idx]}
                  onChange={(v) => updateFscMarkArray('testedMarks', idx, v)}
                />
              ))}
              <h3 className="wide">Repair arrangements (5 items)</h3>
              {REPAIR_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`repair-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.repairMarks[idx]}
                  onChange={(v) => updateFscMarkArray('repairMarks', idx, v)}
                />
              ))}
            </div>
          )}

          {activeSection === 6 && (
            <div className="form-grid">
              <h3 className="wide">12-month schedule of items inspected</h3>
              {INSP12_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`12m-insp-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.twelveMonthInspectionMarks[idx]}
                  onChange={(v) => updateFscMarkArray('twelveMonthInspectionMarks', idx, v)}
                />
              ))}
              <h3 className="wide">12-month schedule of items tested</h3>
              {TEST12_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`12m-test-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.twelveMonthTestMarks[idx]}
                  onChange={(v) => updateFscMarkArray('twelveMonthTestMarks', idx, v)}
                />
              ))}
            </div>
          )}

          {activeSection === 7 && (
            <div className="form-grid">
              <h3 className="wide">Additional checks upon change of servicing organisation</h3>
              {ADDITIONAL_LABELS.map((label, idx) => (
                <MarkSelect
                  key={`add-${idx}`}
                  label={`${idx + 1}. ${label}`}
                  value={fscForm.additionalMarks[idx]}
                  onChange={(v) => updateFscMarkArray('additionalMarks', idx, v)}
                />
              ))}
            </div>
          )}

          {activeSection === 8 && (
            <div className="review-card">
              <p>Client: <strong>{fscForm.clientName}</strong></p>
              <p>Reference: <strong>{fscForm.metaReference}</strong></p>
              <p>Inspector: <strong>{fscForm.contractorName} ({fscForm.contractorPosition})</strong></p>
              <p>Premises ticked: <strong>{fscForm.premisesMarks.filter((m) => m === 'tick').length}/13</strong></p>
              <p>Tested ticked: <strong>{fscForm.testedMarks.filter((m) => m === 'tick').length}/16</strong></p>
              <button type="button" className="primary-action" onClick={downloadFscPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled FSC'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadFscPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled FSC') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'pat-form') {
    const sections = [
      'Certificate & client details',
      'Contractor details',
      'Appliance test rows',
      'Review',
    ]
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">PAT 1-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Fill all PAT fields and download with the same template design.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label>Certificate Number<input value={patForm.certificateNumber} onChange={(e) => updatePatField('certificateNumber', e.target.value)} /></label>
              <label>Certificate Date<input type="date" value={patForm.certificateDate} onChange={(e) => updatePatField('certificateDate', e.target.value)} /></label>
              <label className="wide">Client Address<input value={patForm.clientAddress} onChange={(e) => updatePatField('clientAddress', e.target.value)} /></label>
              <label>Client Postcode<input value={patForm.clientPostcode} onChange={(e) => updatePatField('clientPostcode', e.target.value)} /></label>
              <label className="wide">Installation Address<input value={patForm.installationAddress} onChange={(e) => updatePatField('installationAddress', e.target.value)} /></label>
              <label>Installation Postcode<input value={patForm.installationPostcode} onChange={(e) => updatePatField('installationPostcode', e.target.value)} /></label>
              <label className="wide">Total Appliances Text<input value={patForm.totalAppliances} onChange={(e) => updatePatField('totalAppliances', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label>Trading Title<input value={patForm.tradingTitle} onChange={(e) => updatePatField('tradingTitle', e.target.value)} /></label>
              <label className="wide">Contractor Address<input value={patForm.contractorAddress} onChange={(e) => updatePatField('contractorAddress', e.target.value)} /></label>
              <label>Contractor Postcode<input value={patForm.contractorPostcode} onChange={(e) => updatePatField('contractorPostcode', e.target.value)} /></label>
              <label>Registration Number<input value={patForm.registrationNumber} onChange={(e) => updatePatField('registrationNumber', e.target.value)} /></label>
              <label>Telephone Number<input value={patForm.telephoneNumber} onChange={(e) => updatePatField('telephoneNumber', e.target.value)} /></label>
              <label>Inspector Name<input value={patForm.inspectorName} onChange={(e) => updatePatField('inspectorName', e.target.value)} /></label>
              <label>Inspector Position<input value={patForm.inspectorPosition} onChange={(e) => updatePatField('inspectorPosition', e.target.value)} /></label>
              <label>Signature<input value={patForm.signature} onChange={(e) => updatePatField('signature', e.target.value)} /></label>
              <label>Test Equipment Used<input value={patForm.testEquipmentUsed} onChange={(e) => updatePatField('testEquipmentUsed', e.target.value)} /></label>
              <label>Equipment Serial Number<input value={patForm.equipmentSerialNumber} onChange={(e) => updatePatField('equipmentSerialNumber', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="appliance-table">
              <h3>Appliance details and test results ({patForm.rows.length} rows)</h3>
              <button type="button" className="secondary-action" onClick={addPatRow}>
                Add More Row
              </button>
              {patForm.rows.map((row, idx) => (
                <div key={`pat-row-${idx}`} className="appliance-row">
                  <label>Appliance ID<input value={row.applianceId} onChange={(e) => updatePatRow(idx, 'applianceId', e.target.value)} /></label>
                  <label>Test Date<input type="date" value={row.testDate} onChange={(e) => updatePatRow(idx, 'testDate', e.target.value)} /></label>
                  <label className="wide">Description<input value={row.description} onChange={(e) => updatePatRow(idx, 'description', e.target.value)} /></label>
                  <label>Location<input value={row.location} onChange={(e) => updatePatRow(idx, 'location', e.target.value)} /></label>
                  <label>Serial Number<input value={row.serialNumber} onChange={(e) => updatePatRow(idx, 'serialNumber', e.target.value)} /></label>
                  <label>Retest Period<input value={row.retestPeriod} onChange={(e) => updatePatRow(idx, 'retestPeriod', e.target.value)} /></label>
                  <label>Retest Date<input type="date" value={row.retestDate} onChange={(e) => updatePatRow(idx, 'retestDate', e.target.value)} /></label>
                  <label>Status<input value={row.status} onChange={(e) => updatePatRow(idx, 'status', e.target.value)} /></label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="review-card">
              <p>Certificate: <strong>{patForm.certificateNumber}</strong></p>
              <p>Client postcode: <strong>{patForm.clientPostcode}</strong></p>
              <p>Inspector: <strong>{patForm.inspectorName}</strong></p>
              <p>Rows filled: <strong>{patForm.rows.filter((r) => r.applianceId.trim() || r.description.trim()).length}</strong></p>
              <button type="button" className="primary-action" onClick={downloadPatPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled PAT'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadPatPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled PAT') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'fet-form') {
    const sections = [
      'Page 2: Meta and premises',
      'Page 2: Contractor details',
      'Page 3: Extinguisher rows',
      'Review',
    ]
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">FET 3-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Fill all FET fields and download with exact template style.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label>Date<input type="date" value={fetForm.date} onChange={(e) => updateFetField('date', e.target.value)} /></label>
              <label className="wide">Certificate Serial No/Ref<input value={fetForm.reference} onChange={(e) => updateFetField('reference', e.target.value)} /></label>
              <label>Premises Name<input value={fetForm.premisesName} onChange={(e) => updateFetField('premisesName', e.target.value)} /></label>
              <label className="wide">Premises Address<input value={fetForm.premisesAddress} onChange={(e) => updateFetField('premisesAddress', e.target.value)} /></label>
              <label className="wide">Additional Comments<input value={fetForm.comments} onChange={(e) => updateFetField('comments', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label>Trading Title<input value={fetForm.tradingTitle} onChange={(e) => updateFetField('tradingTitle', e.target.value)} /></label>
              <label className="wide">Contractor Address (use new lines)
                <textarea rows={3} value={fetForm.contractorAddress} onChange={(e) => updateFetField('contractorAddress', e.target.value)} />
              </label>
              <label>Contractor Name<input value={fetForm.contractorName} onChange={(e) => updateFetField('contractorName', e.target.value)} /></label>
              <label>Signature<input value={fetForm.signature} onChange={(e) => updateFetField('signature', e.target.value)} /></label>
              <label>Position<input value={fetForm.contractorPosition} onChange={(e) => updateFetField('contractorPosition', e.target.value)} /></label>
              <label>Date<input type="date" value={fetForm.contractorDate} onChange={(e) => updateFetField('contractorDate', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="appliance-table">
              <h3>Portable Fire Extinguishers ({fetForm.rows.length} rows)</h3>
              <button type="button" className="secondary-action" onClick={addFetRow}>
                Add More Row
              </button>
              {fetForm.rows.map((row, idx) => (
                <div key={`fet-row-${idx}`} className="appliance-row">
                  <label>Item No<input value={row.itemNo} onChange={(e) => updateFetRow(idx, 'itemNo', e.target.value)} /></label>
                  <label>Location<input value={row.location} onChange={(e) => updateFetRow(idx, 'location', e.target.value)} /></label>
                  <label>Make<input value={row.make} onChange={(e) => updateFetRow(idx, 'make', e.target.value)} /></label>
                  <label>Serial Number<input value={row.serialNumber} onChange={(e) => updateFetRow(idx, 'serialNumber', e.target.value)} /></label>
                  <label>Type<input value={row.type} onChange={(e) => updateFetRow(idx, 'type', e.target.value)} /></label>
                  <label>Capacity L<input value={row.capacity} onChange={(e) => updateFetRow(idx, 'capacity', e.target.value)} /></label>
                  <label className="wide">Remarks<input value={row.remarks} onChange={(e) => updateFetRow(idx, 'remarks', e.target.value)} /></label>
                  <label>Retest Date<input type="date" value={row.retest} onChange={(e) => updateFetRow(idx, 'retest', e.target.value)} /></label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="review-card">
              <p>Reference: <strong>{fetForm.reference}</strong></p>
              <p>Premises: <strong>{fetForm.premisesName}</strong></p>
              <p>Contractor: <strong>{fetForm.contractorName}</strong></p>
              <p>Rows filled: <strong>{fetForm.rows.filter((r) => r.itemNo.trim() || r.location.trim() || r.make.trim()).length}</strong></p>
              <button type="button" className="primary-action" onClick={downloadFetPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled FET'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadFetPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled FET') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'legionella-form') {
    const sections = [
      'Page 1 fields',
      'Page 5 fields',
      'Pages 7,8,9 fields',
      'Pages 14,15,16,17 fields',
      'Page 23 fields',
      'Pages 25,26,27 fields',
      'Review',
    ]
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">Legionella 27-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Only requested pages are editable; all other pages remain static.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label className="wide">Page 1 Property Address<input value={legionellaForm.page1PropertyAddress} onChange={(e) => updateLegionellaField('page1PropertyAddress', e.target.value)} /></label>
              <label>Page 1 Client Name<input value={legionellaForm.page1ClientName} onChange={(e) => updateLegionellaField('page1ClientName', e.target.value)} /></label>
              <label>Page 1 Assessor Name<input value={legionellaForm.page1AssessorName} onChange={(e) => updateLegionellaField('page1AssessorName', e.target.value)} /></label>
              <label>Page 1 Reference<input value={legionellaForm.page1Reference} onChange={(e) => updateLegionellaField('page1Reference', e.target.value)} /></label>
              <label>Page 1 Assessment Date<input type="date" value={legionellaForm.page1AssessmentDate} onChange={(e) => updateLegionellaField('page1AssessmentDate', e.target.value)} /></label>
              <label>Page 1 Property Type<input value={legionellaForm.page1PropertyType} onChange={(e) => updateLegionellaField('page1PropertyType', e.target.value)} /></label>
              <label>Page 1 Duty Holder<input value={legionellaForm.page1DutyHolder} onChange={(e) => updateLegionellaField('page1DutyHolder', e.target.value)} /></label>
              <label className="wide">Page 1 Responsible Persons<input value={legionellaForm.page1ResponsiblePersons} onChange={(e) => updateLegionellaField('page1ResponsiblePersons', e.target.value)} /></label>
              <label>Policy Exists<input value={legionellaForm.page1PolicyExists} onChange={(e) => updateLegionellaField('page1PolicyExists', e.target.value)} /></label>
              <label>Trained / Competent<input value={legionellaForm.page1TrainedCompetent} onChange={(e) => updateLegionellaField('page1TrainedCompetent', e.target.value)} /></label>
              <label>Contractors Approved<input value={legionellaForm.page1ContractorsApproved} onChange={(e) => updateLegionellaField('page1ContractorsApproved', e.target.value)} /></label>
              <label>Written Scheme<input value={legionellaForm.page1WrittenScheme} onChange={(e) => updateLegionellaField('page1WrittenScheme', e.target.value)} /></label>
              <label>Schematic Supplied<input value={legionellaForm.page1SchematicSupplied} onChange={(e) => updateLegionellaField('page1SchematicSupplied', e.target.value)} /></label>
              <label>Occupied<input value={legionellaForm.page1Occupied} onChange={(e) => updateLegionellaField('page1Occupied', e.target.value)} /></label>
              <label className="wide">Page 1 Cover Note<input value={legionellaForm.page1CoverNote} onChange={(e) => updateLegionellaField('page1CoverNote', e.target.value)} /></label>
              <label className="wide">Page 1 Location (multi-line)
                <textarea rows={3} value={legionellaForm.page1Location} onChange={(e) => updateLegionellaField('page1Location', e.target.value)} />
              </label>
              <label>Page 1 Inspected On<input value={legionellaForm.page1InspectedOn} onChange={(e) => updateLegionellaField('page1InspectedOn', e.target.value)} /></label>
              <label>Page 1 Our Ref<input value={legionellaForm.page1OurRef} onChange={(e) => updateLegionellaField('page1OurRef', e.target.value)} /></label>
              <label>Page 1 Footer Company<input value={legionellaForm.page1FooterCompany} onChange={(e) => updateLegionellaField('page1FooterCompany', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label className="wide">Page 5 Scope<input value={legionellaForm.page5Scope} onChange={(e) => updateLegionellaField('page5Scope', e.target.value)} /></label>
              <label className="wide">Page 5 Limitations<input value={legionellaForm.page5Limitations} onChange={(e) => updateLegionellaField('page5Limitations', e.target.value)} /></label>
              <label className="wide">Page 5 System Type<input value={legionellaForm.page5SystemType} onChange={(e) => updateLegionellaField('page5SystemType', e.target.value)} /></label>
              <label>Wholesome Supply<input value={legionellaForm.page5WholesomeSupply} onChange={(e) => updateLegionellaField('page5WholesomeSupply', e.target.value)} /></label>
              <label>Fittings Suitable<input value={legionellaForm.page5FittingsSuitable} onChange={(e) => updateLegionellaField('page5FittingsSuitable', e.target.value)} /></label>
              <label className="wide">Page 5 Overview<input value={legionellaForm.page5Overview} onChange={(e) => updateLegionellaField('page5Overview', e.target.value)} /></label>
              <label className="wide">Page 5 Control Strategy<input value={legionellaForm.page5ControlStrategy} onChange={(e) => updateLegionellaField('page5ControlStrategy', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="form-grid">
              <label className="wide">Page 7 Photo URL<input value={legionellaForm.page7PhotoUrl} onChange={(e) => updateLegionellaField('page7PhotoUrl', e.target.value)} /></label>
              <label className="wide">Page 8 Note<input value={legionellaForm.page8Note} onChange={(e) => updateLegionellaField('page8Note', e.target.value)} /></label>
              <label className="wide">Page 9 Note<input value={legionellaForm.page9Note} onChange={(e) => updateLegionellaField('page9Note', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 3 && (
            <div className="form-grid">
              <label className="wide">Page 14 Photo URL<input value={legionellaForm.page14PhotoUrl} onChange={(e) => updateLegionellaField('page14PhotoUrl', e.target.value)} /></label>
              <label className="wide">Page 15 Photo URL<input value={legionellaForm.page15PhotoUrl} onChange={(e) => updateLegionellaField('page15PhotoUrl', e.target.value)} /></label>
              <label className="wide">Page 16 Photo URL<input value={legionellaForm.page16PhotoUrl} onChange={(e) => updateLegionellaField('page16PhotoUrl', e.target.value)} /></label>
              <label className="wide">Page 17 Photo URL<input value={legionellaForm.page17PhotoUrl} onChange={(e) => updateLegionellaField('page17PhotoUrl', e.target.value)} /></label>
              <label className="wide">Page 17 Note<input value={legionellaForm.page17Note} onChange={(e) => updateLegionellaField('page17Note', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 4 && (
            <div className="form-grid">
              <label className="wide">Page 23 Photo 1 URL<input value={legionellaForm.page23Photo1Url} onChange={(e) => updateLegionellaField('page23Photo1Url', e.target.value)} /></label>
              <label className="wide">Page 23 Photo 2 URL<input value={legionellaForm.page23Photo2Url} onChange={(e) => updateLegionellaField('page23Photo2Url', e.target.value)} /></label>
              <label className="wide">Page 23 Photo 3 URL<input value={legionellaForm.page23Photo3Url} onChange={(e) => updateLegionellaField('page23Photo3Url', e.target.value)} /></label>
              <label className="wide">Page 23 Photo 4 URL<input value={legionellaForm.page23Photo4Url} onChange={(e) => updateLegionellaField('page23Photo4Url', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 5 && (
            <div className="form-grid">
              <label className="wide">Page 25 Summary<input value={legionellaForm.page25Summary} onChange={(e) => updateLegionellaField('page25Summary', e.target.value)} /></label>
              <label>Page 25 Risk Level<input value={legionellaForm.page25RiskLevel} onChange={(e) => updateLegionellaField('page25RiskLevel', e.target.value)} /></label>
              <label>Page 25 Risk Text<input value={legionellaForm.page25RiskText} onChange={(e) => updateLegionellaField('page25RiskText', e.target.value)} /></label>
              <label>Page 25 Review Date<input value={legionellaForm.page25ReviewDate} onChange={(e) => updateLegionellaField('page25ReviewDate', e.target.value)} /></label>
              <label className="wide">Page 26 Subtitle (multi-line)
                <textarea rows={3} value={legionellaForm.page26Subtitle} onChange={(e) => updateLegionellaField('page26Subtitle', e.target.value)} />
              </label>
              <label>Page 26 Assessor Name<input value={legionellaForm.page26AssessorName} onChange={(e) => updateLegionellaField('page26AssessorName', e.target.value)} /></label>
              <label>Page 26 Email<input value={legionellaForm.page26Email} onChange={(e) => updateLegionellaField('page26Email', e.target.value)} /></label>
              <label>Page 26 Assessment Date<input value={legionellaForm.page26AssessmentDate} onChange={(e) => updateLegionellaField('page26AssessmentDate', e.target.value)} /></label>
              <label className="wide">Page 26 Certificate Copy<input value={legionellaForm.page26Copy} onChange={(e) => updateLegionellaField('page26Copy', e.target.value)} /></label>
              <label className="wide">Page 27 Schematic URL<input value={legionellaForm.page27SchematicUrl} onChange={(e) => updateLegionellaField('page27SchematicUrl', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 6 && (
            <div className="review-card">
              <p>Reference: <strong>{legionellaForm.page1Reference}</strong></p>
              <p>Property: <strong>{legionellaForm.page1PropertyAddress}</strong></p>
              <p>Assessor: <strong>{legionellaForm.page1AssessorName}</strong></p>
              <button type="button" className="primary-action" onClick={downloadLegionellaPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled Legionella'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadLegionellaPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled Legionella') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'fdi-form') {
    const sections = [
      { title: 'Page 1 fields', prefixes: ['page1'] },
      { title: 'Page 2 fields', prefixes: ['page2'] },
      { title: 'Page 4 fields', prefixes: ['page4'] },
      { title: 'Page 5 fields', prefixes: ['page5'] },
      { title: 'Page 6 fields', prefixes: ['page6'] },
      { title: 'Page 8 fields', prefixes: ['page8'] },
      { title: 'Review', prefixes: [] },
    ]
    const isLast = activeSection === sections.length - 1
    const activePrefixes = sections[activeSection]?.prefixes ?? []
    const sectionKeys = (Object.keys(fdiForm) as Array<keyof FdiFormData>).filter((key) =>
      activePrefixes.some((prefix) => String(key).startsWith(prefix)),
    )
    const formatFieldLabel = (key: string) =>
      key
        .replace(/^page\d+/, (m) => m.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim()

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>Back to templates</button>
          <p className="eyebrow">FDI 10-page form</p>
          <h1>{sections[activeSection]?.title}</h1>
          <p className="lede">All requested fields are editable; other pages remain static.</p>
        </section>
        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((section, idx) => (
            <button
              key={section.title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{section.title}</small>
            </button>
          ))}
        </section>
        <section className="form-panel">
          {activeSection !== sections.length - 1 && (
            <div className="form-grid">
              {sectionKeys.map((key) => {
                const name = String(key)
                const isWide = name.includes('Details') || name.includes('Footer') || name.includes('Address') || name.includes('Summary') || name.includes('Introduction') || name.includes('Notes')
                return (
                  <label key={name} className={isWide ? 'wide' : ''}>
                    {formatFieldLabel(name)}
                    <input value={fdiForm[key]} onChange={(e) => updateFdiField(key, e.target.value)} />
                  </label>
                )
              })}
            </div>
          )}
          {activeSection === sections.length - 1 && (
            <div className="review-card">
              <p>Project: <strong>{fdiForm.page2ProjectSite}</strong></p>
              <p>Client: <strong>{fdiForm.page2Client}</strong></p>
              <p>Door Ref: <strong>{fdiForm.page8DoorReference}</strong></p>
              <button type="button" className="primary-action" onClick={downloadFdiPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled FDI'}
              </button>
            </div>
          )}
          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => (activeSection === 0 ? setActiveView('home') : setActiveSection((s) => Math.max(0, s - 1)))}
            >
              {activeSection === 0 ? 'Back' : 'Previous'}
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadFdiPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled FDI') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (activeView === 'asbestos-form') {
    const sectionPages: Array<1 | 2 | 4 | 5 | 6 | 7 | 9 | 12> = [1, 2, 4, 5, 6, 7, 9, 12]
    const sections = [...sectionPages.map((page) => `Page ${page} fields`), 'Review']
    const isLast = activeSection === sections.length - 1
    const activePage = sectionPages[activeSection]
    const sectionFields = activePage
      ? asbestosFieldDefs.filter((field) => field.page === activePage)
      : []

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">Asbestos 13-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Only requested pages are editable; all other pages remain static.</p>
        </section>
        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>
        <section className="form-panel">
          {!isLast && (
            <div className="form-grid">
              {sectionFields.map((field) => (
                <label key={field.key} className={field.wide ? 'wide' : ''}>
                  {field.label}
                  {asbestosDateKeys.has(field.key) ? (
                    <input
                      type="date"
                      value={toCalendarValue(asbestosForm[field.key] ?? '')}
                      onChange={(e) => updateAsbestosField(field.key, fromCalendarValue(e.target.value))}
                    />
                  ) : (
                    <input
                      value={asbestosForm[field.key] ?? ''}
                      onChange={(e) => updateAsbestosField(field.key, e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          )}
          {isLast && (
            <div className="review-card">
              <p>Reference: <strong>{asbestosForm.page1Ref || '-'}</strong></p>
              <p>Client: <strong>{asbestosForm.page2Client || '-'}</strong></p>
              <p>Site: <strong>{asbestosForm.page2SiteAddress || '-'}</strong></p>
              <button type="button" className="primary-action" onClick={downloadAsbestosPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled Asbestos'}
              </button>
            </div>
          )}
          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadAsbestosPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled Asbestos') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="picker-panel" aria-labelledby="pdf-picker-title">
        <div className="picker-header">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 id="pdf-picker-title">Choose a PDF template</h2>
          </div>
          <p className="picker-note">7 templates available</p>
        </div>

        <div className="pdf-grid" role="list" aria-label="PDF templates">
          {pdfOptions.map((pdfName) => {
            const isSelected = pdfName === selectedPdf

            return (
              <button
                key={pdfName}
                type="button"
                className={`pdf-card${isSelected ? ' selected' : ''}`}
                onClick={() => setSelectedPdf(pdfName)}
                aria-pressed={isSelected}
              >
                <span className="pdf-index">PDF</span>
                <span className="pdf-name">{pdfName}</span>
                <span className="pdf-action">
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="selection-panel">
        <div>
          <p className="eyebrow">Current selection</p>
          <h2>{selectedPdf}</h2>
          <p className="selection-copy">
            Click the button to open the form and download the filled certificate.
          </p>
        </div>
        <button type="button" className="primary-action" onClick={openSelectedLayout}>
          Open Form
        </button>
      </section>
    </main>
  )
}

export default App
