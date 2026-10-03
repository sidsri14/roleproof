export interface RawJob {
  title?: string
  company_name?: string
  location?: string
  description?: string
  extensions?: string[]
  detected_extensions?: {
    posted_at?: string
    schedule_type?: string
    work_from_home?: boolean
  }
  share_link?: string
  apply_options?: Array<{ link?: string; title?: string }>
}

export interface RoleReview {
  title: string
  company: string
  location: string
  postedAt?: string
  schedule?: string
  link?: string
  eligible: boolean
  reasons: string[]
}
