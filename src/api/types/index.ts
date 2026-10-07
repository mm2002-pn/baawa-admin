// ========== ENUMS ==========

export enum Role {
  CITOYEN = 'CITOYEN',
  POLICIER = 'POLICIER',
  ADMIN_BAAWA = 'ADMIN_BAAWA',
  ADMIN_SCHOOL = 'ADMIN_SCHOOL',
}

export enum Gender {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ',
  AUTRE = 'AUTRE',
}

export enum AlertStatus {
  URGENT = 'URGENT',
  INFO_RECUE = 'INFO_RECUE',
  STANDARD = 'STANDARD',
  RESOLVED = 'RESOLVED',
}

export enum SignalementStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  VERIFIED = 'VERIFIED',
  ARCHIVED = 'ARCHIVED',
}

export enum Relationship {
  PARENT = 'PARENT',
  FRERE_SOEUR = 'FRERE_SOEUR',
  AMI = 'AMI',
  CONJOINT = 'CONJOINT',
  TEMOIN = 'TEMOIN',
  AUTRE = 'AUTRE',
}

// ========== USER TYPES ==========

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  isVerified: boolean
  isActive: boolean
  zoneGeo?: string
  createdAt: string
  updatedAt?: string
  lastLoginAt?: string | null
  officer?: Officer
  schoolId?: string | null
  mustChangePassword?: boolean
}

export interface Officer {
  id: string
  userId: string
  badgeNumber: string
  rank: string
  policeUnit: string
  zoneGeo?: string
  joinedAt?: string
}

export interface UserWithOfficer extends User {
  officer?: Officer
}

// ========== MISSING PERSON TYPES ==========

export interface MissingPerson {
  id: string
  fullName: string
  age: number
  gender: Gender
  photoUrls: string[]
  disappearanceDate: string
  disappearanceTime: string
  lastLatitude: number
  lastLongitude: number
  lastAddress: string
  region: string
  clothingDescription: string
  status: AlertStatus
  viewCount: number
  shareCount: number
  cameraName?: string | null
  cameraImageUrl?: string | null
  createdAt: string
  updatedAt: string
  resolvedAt?: string | null
}

// ========== SIGNALEMENT TYPES ==========

export interface Signalement {
  id: string
  missingPersonId: string
  missingPerson?: MissingPerson
  reporterId: string
  reporter?: User
  relationship: Relationship
  phoneNumber: string
  policeReportNumber?: string
  status: SignalementStatus
  createdAt: string
  publishedAt?: string | null
  verifiedAt?: string | null
  updatedAt: string
  tips?: Tip[]
}

export interface SignalementWithDetails extends Signalement {
  missingPerson: MissingPerson
  reporter: User
  tips: Tip[]
}

// ========== TIP TYPES ==========

export interface Tip {
  id: string
  signalementId: string
  signalement?: Signalement
  reporterId: string
  reporter?: User
  missingPersonId: string
  description: string
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  isVerified: boolean
  verifiedBy?: string | null
  verifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface TipWithDetails extends Tip {
  reporter: User
  signalement: Signalement
  missingPerson: MissingPerson
}

// ========== AUTH TYPES ==========

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface BackendAuthResponse {
  success: boolean
  statusCode: number
  message: string
  data: AuthResponse
}

export interface TokenPayload {
  sub: string
  email: string
  role: Role
  iat: number
  exp: number
}

// ========== API RESPONSE TYPES ==========

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ========== DASHBOARD TYPES ==========

export interface DashboardStats {
  totalUsers: number
  activeSignalements: number
  resolvedThisMonth: number
  newToday: number
  usersTrend?: number
  signalementsTrend?: number
  resolvedTrend?: number
}

export interface SignalementStats {
  date: string
  count: number
}

export interface RegionStats {
  region: string
  count: number
}

export interface StatusDistribution {
  status: SignalementStatus
  count: number
  percentage: number
}

// ========== FILTER & SEARCH TYPES ==========

export interface UserFilters {
  search?: string
  role?: Role
  isActive?: boolean
  isVerified?: boolean
  zoneGeo?: string
}

export interface SignalementFilters {
  status?: SignalementStatus
  alertStatus?: AlertStatus
  region?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface TipFilters {
  isVerified?: boolean
  signalementId?: string
  startDate?: string
  endDate?: string
  search?: string
}

// ========== FORM DTO TYPES ==========

export interface CreateUserDto {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role?: Role
  isActive?: boolean
}

export interface UpdateOfficerDto {
  badgeNumber?: string
  rank?: string
  policeUnit?: string
  zoneGeo?: string
}

export interface VerifySignalementDto {
  verified: boolean
}

export interface ResolveSignalementDto {
  resolved: boolean
}

export interface VerifyTipDto {
  verified: boolean
}

// ========== SCHOOL TYPES ==========

export interface School {
  id: string
  name: string
  address?: string
  region?: string
  phoneNumber?: string
  email?: string
  isActive: boolean
  createdAt: string
  _count?: { students: number; users: number; trackers?: number }
}

/** Boîtier tel qu'il apparaît sur la fiche d'un élève. */
export interface StudentTracker {
  id: string
  imei: string
  label?: string | null
  state: TrackerState
  traccarDeviceId: number | null
  assignedAt?: string | null
}

export interface Student {
  id: string
  schoolId: string
  firstName: string
  lastName: string
  className?: string
  gender?: Gender
  birthDate?: string | null
  photoUrl?: string | null
  parentName?: string
  parentPhone?: string
  tracker?: StudentTracker | null
  isActive: boolean
  createdAt: string
}

export interface CreateSchoolDto {
  name: string
  address?: string
  region?: string
  phoneNumber?: string
  email?: string
}

export interface CreateSchoolUserDto {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface CreateStudentDto {
  firstName: string
  lastName: string
  className?: string
  gender?: Gender
  birthDate?: string
  photoUrl?: string
  parentName?: string
  parentPhone?: string
  /** Boîtier à attribuer. En modification, null retire le boîtier. */
  trackerId?: string | null
}

export type UpdateStudentDto = Partial<CreateStudentDto>

export interface SchoolUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  isActive: boolean
  createdAt: string
}

// ========== GPS / POSITIONS ==========

export interface TraccarPosition {
  deviceId: number
  latitude: number
  longitude: number
  /** Vitesse en nœuds (unité de Traccar) */
  speed: number
  speedKmh: number
  /** Heure du point GPS — peut être ancienne si le boîtier est en intérieur */
  fixTime: string
  address?: string | null
  batteryLevel: number | null
  charging: boolean | null
}

/** État de connexion remonté par Traccar ('unknown' = jamais connecté). */
export type TrackerStatus = 'online' | 'offline' | 'unknown'

export interface TrackerLive {
  position: TraccarPosition | null
  deviceStatus: TrackerStatus
  /** Heure du dernier message reçu du boîtier, avec ou sans position */
  lastUpdate: string | null
}

export interface StudentPositionEntry extends TrackerLive {
  studentId: string
  firstName: string
  lastName: string
  className?: string | null
  tracker: StudentTracker | null
  traccarDeviceId: number | null
}

// ========== BOÎTIERS GNSS ==========

export type TrackerState = 'ACTIVE' | 'OUT_OF_SERVICE' | 'LOST'

/** Où en est un boîtier : stock BAAWA, libre dans une école, porté par un élève, ou vendu en direct. */
export type TrackerAssignment = 'stock' | 'available' | 'assigned' | 'direct'

export interface TrackerStudent {
  id: string
  firstName: string
  lastName: string
  className?: string | null
}

export interface Tracker {
  id: string
  imei: string
  label?: string | null
  model: string
  simNumber?: string | null
  traccarDeviceId: number | null
  state: TrackerState
  notes?: string | null
  schoolId: string | null
  studentId: string | null
  assignedAt?: string | null
  createdAt: string
  school?: { id: string; name: string } | null
  student?: TrackerStudent | null
  /** Numéro du parent acheteur ; `owner` est renseigné quand il a un compte vérifié */
  ownerPhone?: string | null
  owner?: { id: string; firstName: string; lastName: string; phoneNumber: string } | null
  /** Abonnement qui couvre le boîtier aujourd'hui */
  subscription?: CurrentSubscription | null
  /** Fin de la couverture, renouvellements déjà payés compris */
  paidUntil?: string | null
  zonesCount?: number
}

/** Boîtier d'une école, avec son état en direct. */
export type SchoolTracker = Tracker & TrackerLive

export interface TrackerStats {
  total: number
  inStock: number
  available: number
  assigned: number
  outOfService: number
  unsynced: number
}

export interface CreateTrackerDto {
  imei: string
  label?: string
  model?: string
  simNumber?: string
  notes?: string
  schoolId?: string
}

export interface UpdateTrackerDto {
  label?: string
  model?: string
  simNumber?: string
  notes?: string
  state?: TrackerState
}

export interface BulkCreateTrackersResult {
  created: number
  skipped: { imei: string; reason: string }[]
}

export interface TrackerFilters {
  coverage?: 'covered' | 'uncovered'
  page?: number
  limit?: number
  search?: string
  schoolId?: string
  assignment?: TrackerAssignment
  state?: TrackerState
}

export interface Paged<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

/** Position d'un boîtier attribué, vue par l'admin BAAWA (toutes écoles). */
export interface FleetPositionEntry extends TrackerLive {
  trackerId: string
  imei: string
  label?: string | null
  state: TrackerState
  school: { id: string; name: string } | null
  student: TrackerStudent | null
}

export interface TrackerAlarm {
  id: string
  trackerId: string
  schoolId: string | null
  studentId: string | null
  /** Valeur brute de Traccar : sos, lowBattery… */
  type: string
  /** Libellé français prêt à afficher */
  label: string
  latitude: number | null
  longitude: number | null
  /** Nombre de déclenchements regroupés dans cet incident */
  /** Zone de sécurité concernée (entrées et sorties de zone) */
  zoneName?: string | null
  count: number
  firstAt: string
  lastAt: string
  acknowledgedAt: string | null
  note: string | null
  tracker: { id: string; imei: string; label?: string | null }
  student: (TrackerStudent & { parentName?: string | null; parentPhone?: string | null }) | null
}

// ========== FORMULES ET ABONNEMENTS ==========

export interface Plan {
  id: string
  name: string
  description?: string | null
  /** Tarif d'une période, en FCFA */
  price: number
  periodMonths: number
  /** Zones de sécurité autorisées par boîtier */
  maxZones: number
  features: string[]
  /** false : la formule n'est plus proposée à la vente */
  isActive: boolean
  sortOrder: number
  activeSubscriptions?: number
}

export type PlanInput = Pick<Plan, 'name' | 'price'> & Partial<Pick<Plan, 'description' | 'periodMonths' | 'maxZones' | 'features' | 'isActive' | 'sortOrder'>>

export type PaymentMethod = 'CASH' | 'WAVE' | 'ORANGE_MONEY' | 'OTHER'

export interface CurrentSubscription {
  id: string
  plan: { id: string; name: string }
  maxZones: number
  startsAt: string
  endsAt: string
}

export interface Subscription extends CurrentSubscription {
  trackerId: string
  status: 'ACTIVE' | 'CANCELLED'
  amount: number
  paymentMethod: PaymentMethod
  paymentReference?: string | null
  note?: string | null
  createdAt: string
}

export interface CreateSubscriptionDto {
  planId: string
  periods?: number
  amount?: number
  paymentMethod: PaymentMethod
  paymentReference?: string
  note?: string
  startsAt?: string
}

export interface SubscriptionStats {
  covered: number
  uncovered: number
  expiringSoon: number
  revenueThisMonth: number
}

export interface DirectSaleDto {
  childFirstName: string
  childLastName: string
  parentPhone: string
  parentName?: string
}

export type AlarmStatusFilter = 'open' | 'acknowledged' | 'all'

// ========== NOTIFICATION TYPES ==========

export interface AppNotification {
  id: string
  userId: string
  title: string
  message: string
  type: string // INFO, ALERT, SUCCESS
  isRead: boolean
  createdAt: string
}
