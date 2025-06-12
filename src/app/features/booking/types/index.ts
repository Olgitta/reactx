export enum SeatStatus {
    AVAILABLE = 1,
    LOCKED = 2,
    BOOKED = 3
}

export const seatStatusLabel = {
    [SeatStatus.AVAILABLE]: 'Available',
    [SeatStatus.LOCKED]: 'Locked',
    [SeatStatus.BOOKED]: 'Booked',
};

/*
* The `seatStatusLabel` object is a **mapping from `SeatStatus` enum values to human-readable labels**. It's typically used to convert internal enum values (like `0`, `1`, `2` or similar) into readable strings for display in the UI.

### Example Usage

You could use it here in your component:

```tsx
title={`Seat ${seat.rowNumber}${seat.seatNumber} - Status: ${seatStatusLabel[seat.statusId]}${areAllSeatsDisabled ? ' (No WS connection)' : ''}`}
```

### Why it's useful

* **Cleaner UI text**: Instead of repeating conditional logic like

  ```tsx
  seat.statusId === SeatStatus.AVAILABLE ? 'Available' :
  seat.statusId === SeatStatus.LOCKED ? 'Locked' :
  'Booked'
  ```

  you just use:

  ```tsx
  seatStatusLabel[seat.statusId]
  ```
* **Easier maintenance**: If you want to change `"Locked"` to `"Temporarily Reserved"`, just do it in one place in the map.
* **Localization**: You can later replace the values in the map with translations (e.g., Hebrew, Russian, etc.) if needed.

### TL;DR:

It's a centralized dictionary to keep your status labels clean, consistent, and easy to manage.

* */