# QR Code Images

This directory contains sample QR code images for demo purposes.

## QR Code Format
All Machikasa QR codes follow this format:
```
machikasa://umbrella/{umbrella_id}
```

## Sample QR Codes
- `umb-001.png` - machikasa://umbrella/umb-001 (Available at 福井大学正門)
- `umb-002.png` - machikasa://umbrella/umb-002 (Available at 福井大学正門)
- `umb-006.png` - machikasa://umbrella/umb-006 (Currently in use - for return testing)
- `umb-007.png` - machikasa://umbrella/umb-007 (Available at ローソン福井大学店)

## Usage
In a real implementation, you would:
1. Generate QR codes using a library like `qrcode`
2. Print these codes on physical labels
3. Attach labels to umbrellas
4. Users scan with their mobile devices

For this demo, the QR scanner component includes manual input options and demo buttons to simulate scanning.