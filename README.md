# Inventory Management Application

This is a Next.js application for managing an inventory of items using Firebase Firestore as the database and Material-UI for the user interface components.

## Features

- View inventory items with filtering options
- Add and remove items from the inventory
- Search items by name
- Categorize items

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **Material-UI**: React UI framework for styling components
- **Firebase**: Backend services for real-time database and authentication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mamir21/Inventory_Tracker.git

2. Navigate to the project directory:
   ```bash
    cd Inventory_Tracker

3. Install dependencies:
   ```bash
    npm install

4. Configure Firebase:
   ```bash
    Create a Firebase project in the Firebase Console.
    Add your Firebase configuration to a .env.local file in the root directory of your project.
   
5. Create a .env.local file:
   ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    Replace the placeholder values with your actual Firebase project credentials.

6. Run the application:
   ```bash
   npm run dev

7. Open http://localhost:3000 in your browser to view the application.

## Usage

- Add New Item: Click the "Add New Item" button, enter the item name and select a category, then click "Add" to include it in the inventory.
- Search Items: Use the search bar to filter items by name.
- Filter by Category: Use the category dropdown to filter items by category.
- Manage Items: Use the "Add" and "Remove" buttons next to each item to adjust quantities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
