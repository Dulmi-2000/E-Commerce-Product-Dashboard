# E-Commerce Product Dashboard

A comprehensive React application for managing an e-commerce product catalog with full CRUD functionality, search/filter capabilities, and optimization features.

## Features

### Product Management
- **Complete CRUD Operations**
  - Add new products with validation
  - Edit existing products
  - Delete products with confirmation
  - Bulk delete functionality
  - Undo delete operations
- **Product Display**
  - Responsive grid layout (3 columns desktop, 2 tablet, 1 mobile)
  - Product cards with image, name, price, category, stock status
  - Loading states and empty states
  - Image fallback handling

### Search and Filtering
- Real-time search by product name and description
- Category filtering
- Price range filtering
- Stock status filtering
- Combined filtering capabilities
- Clear filters functionality

### Data Management
- Local storage persistence
- Optimistic updates
- Data validation
- Error handling
- Loading states

### Performance Optimizations
- Component memoization
- Debounced search (300ms)
- Optimized re-renders
- Lazy loading for images
- Error boundaries

### User Experience
- Responsive design
- Loading states
- Error handling
- Accessibility features
- Toast notifications
- Confirmation dialogs

## Technical Stack

- **Frontend**: React.js, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks (useState, useReducer)
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, tailwind-merge

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/ecommerce-product-dashboard.git
```

2. Navigate to project directory:
```bash
cd ecommerce-product-dashboard
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── constants/         # Application constants
└── lib/              # Library configurations
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Quality Standards

- Clean, readable code with meaningful names
- Proper component organization
- Comprehensive comments for complex logic
- Consistent coding style
- Accessibility best practices

## Testing

The project includes comprehensive tests for:
- Product form validation
- Product list rendering
- Search and filter functionality
- CRUD operations
- Local storage operations

## Performance Considerations

- Components are memoized where appropriate
- Event handlers are optimized with useCallback
- Expensive calculations use useMemo
- Search is debounced to prevent excessive filtering
- Images are lazy loaded
- Error boundaries handle component errors gracefully

## Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
