# Supermarket Management System - Modern UI Redesign

This is a modern redesign of the supermarket management system UI using Tailwind CSS and a component library.

## Features

### Design System
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Dark/Light Mode**: Automatic theme switching with localStorage persistence
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: WCAG compliant components
- **Animations**: Subtle animations with Framer Motion

### UI Components
- **Sidebar**: Collapsible navigation with icon support
- **Header**: Search and user profile
- **Dashboard**: Data visualization cards and charts
- **POS System**: Barcode scanning optimized for tablets
- **Data Tables**: Sortable, paginated tables with TanStack Table
- **Forms**: Validation with React Hook Form and Zod

### Technologies Used
- React 18 with TypeScript
- Tailwind CSS v3
- Framer Motion for animations
- Lucide React for icons
- TanStack Table for data tables
- React Hook Form + Zod for form validation
- React Router v6 for navigation

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Component Library

All UI components are located in `src/components/ui/`:

- `Sidebar.tsx` - Collapsible navigation sidebar
- `Header.tsx` - Application header with search
- `Table.tsx` - Responsive data table with pagination
- `Form.tsx` - Form components with validation
- `ThemeContext.tsx` - Dark/light mode context

## Pages

- `Dashboard.tsx` - Main dashboard with metrics
- `POS.tsx` - Point of Sale interface with barcode support
- `Products.tsx` - Product management
- `Categories.tsx` - Category management
- `Suppliers.tsx` - Supplier management

## Theme Customization

The theme can be customized in `tailwind.config.js`. The default theme includes:

- Primary color palette
- Dark mode support
- Responsive breakpoints
- Custom component classes

## Printer-Friendly Receipts

The POS system includes printer-friendly receipt functionality. Use the "Print Receipt" button to generate a printable version.

## Migration Steps

1. Installed required dependencies
2. Created new component library in `src/components/ui/`
3. Implemented theme context for dark/light mode
4. Redesigned all pages with modern UI components
5. Updated routing and layout structure
6. Added responsive design for all screen sizes
7. Implemented barcode scanning in POS
8. Added form validation and data tables

## Storybook

To run Storybook for component development:

```bash
npm run storybook
```

Stories for all components are located in `src/stories/`.