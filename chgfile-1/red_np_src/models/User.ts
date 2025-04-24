export interface User {
  _id: string
  fullName: string
  userName: string
  userEmoji: string
  weeklyRank: number
  userLevel: { [category: string]: number }
  userSwipe: number
  userBio: string
  // gender?: string
  dateOfBirth?: Date
  email: string
  // profileImage?: string
}
