export enum Time {
  SECOND = 1,
  SECOND_MS = 1000,
  MINUTE = Time.SECOND * 60,
  MINUTE_MS = Time.SECOND_MS * 60,
  HOUR = Time.MINUTE * 60,
  HOUR_MS = Time.MINUTE_MS * 60,
  DAY = Time.HOUR * 24,
  DAY_MS = Time.HOUR_MS * 24
}
