# Component Reference

| Component | Purpose | Key Analytics Events | Example Usage |
|-----------|---------|---------------------|---------------|
| **Button** | Button component with built-in analytics tracking for click events | button_click | `analyticsId="button-id"` |
| **TextBox** | Text input component with built-in analytics tracking for focus, blur, and change events | textbox_focus, textbox_blur, textbox_change | `analyticsId="textbox-id"` |
| **DatePicker** | Date picker component with built-in analytics tracking for date selection and calendar interactions | datepicker_open, datepicker_close, datepicker_select | `analyticsId="datepicker-id"` |
| **Popup** | Modal/popup component with built-in analytics tracking for open, close, and interaction events | popup_open, popup_close | `analyticsId="popup-id"` |

## Quick Integration Checklist

- [ ] Install package: `npm install @your-org/react-analytics-ui`
- [ ] Create analytics adapter implementing `AnalyticsAdapter` interface
- [ ] Wrap app with `<AnalyticsProvider adapter={myAdapter}>`
- [ ] Add `analyticsId` prop to components you want to track
- [ ] Add `analyticsMetadata` for context-specific information
- [ ] Test events are flowing to your analytics platform

## Analytics Props (Common to All Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `analyticsId` | string | undefined | Unique identifier for this component instance |
| `analyticsMetadata` | Record<string, any> | undefined | Additional context data to include in events |
| `disableAnalytics` | boolean | false | Disable analytics tracking for this component |

## Event Metadata by Component

### Button
- **button_click**: Fired when the button is clicked

### TextBox
- **textbox_focus**: Fired when the input receives focus
- **textbox_blur**: Fired when the input loses focus
  - Metadata: Includes duration (time focused in milliseconds) and hasValue (boolean)
- **textbox_change**: Fired when the input value changes (only if trackOnChange is true)

### DatePicker
- **datepicker_open**: Fired when the calendar is opened
- **datepicker_close**: Fired when the calendar is closed
  - Metadata: Includes duration (time opened in milliseconds)
- **datepicker_select**: Fired when a date is selected
  - Metadata: Includes selectedDate (ISO string)

### Popup
- **popup_open**: Fired when the popup is opened
- **popup_close**: Fired when the popup is closed
  - Metadata: Includes duration (time opened in milliseconds) and closeMethod (button, overlay, escape)

---

For complete API documentation, see `component-manifest.json`.
