# GoSaveMe - ChatBot and Submission dashboard done with Inertia (Vite & Laravel)

<table>
  <tr>
    <td align="center"><img src="" alt="Chatbot" width="250"></td>
    <td align="center"><img src="" alt="Dashboard" width="250"></td>
    <td align="center"><img src="" alt="Submission" width="250"></td>
  </tr>
</table>

**Developed for the DeaconCode Hackathon at Wake Forest University – Best Project Winner**

Our project was built during the DeaconCode Hackathon at Wake Forest University, where we were asked to tackle real-world challenges in the health field. We developed a solution that streamlines donation requests for health crises by integrating a dynamic chatbot with a submission dashboard. Our innovative approach earned us first place and recognition for the Best Project.

## Project Overview

This project is envisioned to enable non-profits to manage donation requests for health crises securely and efficiently. Unlike traditional donation platforms like GoFundMe, our solution prioritizes privacy and fraud verification by collecting sensitive information through an interactive chatbot without publicizing the applicant’s health crisis.

### Key Challenges Addressed

- **Efficient Donation Request Submission:**  
  The platform uses a chatbot powered by the Gemini API to ask dynamic, case-specific questions. Gathering detailed information required to verify the case.

- **Submission Dashboard:**  
  A dashboard lists all submissions and provides expandable views for administrators to review and verify each request.

## Technologies Used

- **Frontend:** Inertia.js, React, Vite, shadcn UI components  
- **Backend:** Laravel  
- **ChatBot Integration:** Gemini API
- **Styling & Icons:** Tailwind

## Getting Started

### Prerequisites

- Node.js
- PHP
- Composer
- Gemini API

### Installation

1. **Clone the repository:**
2. **Install backend dependencies:**

   """bash
   composer install
   php artisan key:generate
   """

3. **Install frontend dependencies:**

   """bash
   npm install
   npm run dev
   """

4. **Configure your environment:**

   - Copy ".env.example" to ".env" and update your database configuration.
   - Set your Gemini API key in your environment file:
     """ 
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     """

5. **Run database migrations:**

   """bash
   php artisan migrate
   """

6. **Run the Project**
  
  """bash
  php artisan serve
  npm run dev
  """

## Future Directions

We plan to further enhance the verification process using machine learning techniques to automatically detect and classify false submissions. Contributions and suggestions to evolve this platform are welcome.

## **Team:** 

- Alejandro Gonzalez Rubio
- Saroj Bhatta
- Risal Shahriar
