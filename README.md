# Pure Platform Blog Website

This is a simple yet powerful blog website developed as part of my internship at Pure Platform. The project initially started as a task to build a basic UI that interacts with back-end endpoints, but I extended it further by adding more features and functionalities.

## Features

- **Create Posts**: Add new blog posts with a name and content.
- **Edit Posts**: Update the content of existing posts.
- **Delete Posts**: Remove unwanted posts easily.
- **Dark Mode**: Toggle between light and dark themes for a better user experience.
- **Validation**: Ensures that both name and content fields are filled before submission.
- **Real-Time Feedback**: Instant feedback using modal popups and validation messages.
- **Responsive UI**: Built with Bootstrap and custom CSS to ensure the site looks great on all devices.

## Tech Stack

- **Back-End**: 
  - Express.js for handling server-side logic and API endpoints.
  - Sqlite3 for lightweight and efficient database management.
  
- **Front-End**:
  - jQuery for DOM manipulation and event handling.
  - SweetAlert for user-friendly alert modals.
  - Bootstrap for responsive design and styling.
  - Custom CSS for additional styling.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/omermohammed9/Pure-Platform-Blog-Website.git
    cd Pure-Platform-Blog-Website
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to view the blog website.

## Usage

- Add new posts by entering a name and content, then clicking the "Publish" button.
- Add new posts as well by clicking 'Enter' button on your keyboard
- Edit or delete posts by clicking the respective buttons on each post card.
- Toggle between light and dark mode using the dark mode switch in the header.

## Future Improvements

- Implement user authentication for more secure post management.
- Add categories and tags to organize posts.
- Enhance the UI/UX with more interactive elements.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
