# Email Templates

## Base Email Template

We've created a base email template to standardize the look and feel of all emails and avoid duplicating configuration. The `BaseEmail` component includes:

- Common Tailwind configuration
- Standard email structure
- Shared styles for common elements

## How to Use

1. Import the BaseEmail component and any needed styles:

```tsx
import {
  BaseEmail,
  logo,
  heading,
  section,
  text,
  hr,
  footer,
} from "./base-email";
```

2. Use the BaseEmail component as a wrapper for your email content:

```tsx
export const YourEmailTemplate = (
  {
    // your props
  }
) => {
  // Set the preview text for the email
  const previewText = "Your email preview text";

  return (
    <BaseEmail preview={previewText}>
      {/* Your email content here */}
      <Img src="/logo.png" style={logo} />
      <Heading style={heading}>Your Email Title</Heading>

      <Section style={section}>
        <Text style={text}>Your email content...</Text>
      </Section>

      <Hr style={hr} />

      <Text style={footer}>Footer text</Text>
    </BaseEmail>
  );
};
```

## Available Shared Styles

The base email template exports the following reusable styles:

- `main`: Body style with background color and padding
- `container`: Container style with white background and rounded corners
- `logo`: Centered logo style
- `heading`: Main heading style
- `section`: Section wrapper style
- `text`: Standard text style
- `hr`: Horizontal rule style
- `footer`: Footer text style

## Custom Styles

Add any custom styles specific to your email template after the component definition:

```tsx
// Custom styles specific to this email
const customSection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  // other styles...
};
```

## Tailwind Configuration

The base template includes the following custom colors:

- `brand`: "hsl(224.44 64.29% 32.94%)"
- `approve`: "#22c55e"
- `reject`: "#ef4444"

To use these colors in Tailwind classes:

```tsx
<Button className="bg-brand text-white px-4 py-2 rounded-md">Click me</Button>
```
