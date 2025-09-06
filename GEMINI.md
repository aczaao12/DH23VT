## Realtime Database Path Structure

- **Activity Definitions:** `activities/${semester}/${activityKey}/${activityName}`
  - `semester`: The current semester (e.g., 'HK1N3')
  - `activityKey`: A unique identifier for the activity (e.g., 'ACT-1678886400000')
  - `activityName`: The full name of the activity (e.g., 'HUY ĐỘNG LỰC LƯỢNG THAM GIA CHỦ NHẬT XANH')
  - Data stored at this path contains `points`.

## Realtime Database Path Structure for User Summaries

- **User Summary:** `users/${userId}/semesters/${semesterId}/summary`
  - `userId`: The Firebase Authentication UID of the user.
  - `semesterId`: The selected semester (e.g., 'HK1N3').
  - Data stored at this path contains:
    - `totalActivities`: Total number of activities.
    - `totalBonusPoints`: Total approved bonus points.
    - `finalScore`: The final calculated score.
    - `lastUpdated`: Timestamp of the last update.