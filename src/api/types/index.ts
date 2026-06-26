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
  _count?: { students: number; users: number }
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
  imei?: string | null
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
  imei?: string
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
  speed: number
  fixTime: string
  address?: string | null
}

export interface StudentPositionEntry {
  studentId: string
  firstName: string
  lastName: string
  traccarDeviceId: number | null
  position: TraccarPosition | null
}

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
