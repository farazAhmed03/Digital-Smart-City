import ReactDOM from 'react-dom/client';
import "leaflet/dist/leaflet.css";
import './index.css';
import App from './App';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './Store/AppContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// ================================
//           IMPORTS
// ================================

// %%%%%%%%%%% LAYOUTS %%%%%%%%%%%
import { TourismLayout } from './Layouts/TourismLayout';
import { EduLayout } from './Layouts/EduLayout';
import { TechLayout } from './Layouts/TechLayout';
import { FoodLayout } from './Layouts/FoodLayout';
import { HealthLayout } from './Layouts/HealthLayout';
import { BusinessLayout } from './Layouts/BusinessLayout';

// %%%%%%%%%%% GENERAL IMPORTS %%%%%%%%%%%
import { PageNotFoundPg } from './Pages/404Page/404Page';
import { Aboutus } from './Pages/AboutUsPage/Aboutus';
import Contactus from './Pages/ContactUs/ContactUs';

// %%%%%%%%%%% EDUCTION SECTOR %%%%%%%%%%%
import { EduHomePage } from './Pages/EducationPage/EduHomePage/EduHomePage';
import { SchoolPage } from './Pages/EducationPage/EduCatagoriesPg/SchoolPg';
import { CollegesPage } from './Pages/EducationPage/EduCatagoriesPg/CollegesPg';
import { OnlineCoursesPage } from './Pages/EducationPage/EduCatagoriesPg/OnlineCourses';
import CourseLandingPage from './Pages/EducationPage/EduCatagoriesPg/CourseLandingPage';
import { SingleLandingPage } from './components/SingleLandingPage/SingleLandingPage.jsx';

// %%%%%%%%%%% TECHNICIANS SECTOR %%%%%%%%%%%
import { TechniciansHomePg } from './Pages/TechniciansPage/TechniciansHomePg/TechniciansHomePg';
import { ElectronicCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/Electronics';
import { PlumbingGasCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/PlumAndGas';
import { PaintingConstructCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/ConstAndPaint';
import { CarpFurnitureCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/Carpentry&Furniture';
import { CleanMaintCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/Cleaning&Maintaining';
import { GardOutdoorCata } from './Pages/TechniciansPage/TechniciansCatagoriesPg/Gardening&Outdoor';

// %%%%%%%%%%% TOURISM SECTOR %%%%%%%%%%%
import { TourismHome } from './Pages/TourismPage/TourismHomepg/TourismHome';
import { Places } from './Pages/TourismPage/TourismCategoriespg/Places';
import { Hotels } from './Pages/TourismPage/TourismCategoriespg/Hotels';
import { Restaurants } from './Pages/TourismPage/TourismCategoriespg/Restaurants';
import { Parks } from './Pages/TourismPage/TourismCategoriespg/Parks';
import { Bazar } from './Pages/TourismPage/TourismCategoriespg/Bazar';
import { TourismLandingPage } from './Pages/TourismPage/Landingpage/TourismLandingpage';
import { TourGuides } from './Pages/TourismPage/TourismCategoriespg/TourGuides';

// %%%%%%%%%%% RESTURANT SECTOR %%%%%%%%%%%
import { FoodHomePage } from './Pages/FoodPage/FoodHomePage/FoodHomePage';
import { FineDiningPage } from './Pages/FoodPage/FoodCatagoriespg/FineDining';
import { CafesPage } from './Pages/FoodPage/FoodCatagoriespg/Cafes';
import { FastFoodPage } from './Pages/FoodPage/FoodCatagoriespg/FastFood';
import { LocalFoodPage } from './Pages/FoodPage/FoodCatagoriespg/LocalFood';
import { BakeriesPage } from './Pages/FoodPage/FoodCatagoriespg/Bakeries';
import { StreetFoodPage } from './Pages/FoodPage/FoodCatagoriespg/StreetFood';

// %%%%%%%%%%% HOSPITAL SECTOR %%%%%%%%%%%
import { HealthHomePage } from './Pages/HealthPage/HealthHomePage/HealthHomePage';
import { SpecialistsLandingPg } from './Pages/HealthPage/HealthCategoriesLandingPgs/Specialists/SpecialistsLandingPg';
import { PharmaciesLandingPg } from './Pages/HealthPage/HealthCategoriesLandingPgs/Pharmacies/PharmaciesLandingPg';
import { SpecialistsPage } from './Pages/HealthPage/HealthCategories/Specialists';
import { PharmaciesPage } from './Pages/HealthPage/HealthCategories/Pharmacies';
import ComingSoon from './Pages/ComingSoon/ComingSoon';


// %%%%%%%%%%% DASHBOARDS %%%%%%%%%%%
import { SuperAdminDashboard } from './Pages/DashBoard/SuperAdmin/SuperAdminLayout/SuperAdminLayout.jsx';
import { SchoolAndClgDashBoard } from "./Pages/DashBoard/EductionDashboard/DashBoardHomeLayout/Dashboard";
import ForgotPass from "./components/Auth/ForgotPass";
import { FoodDashboard } from './Pages/DashBoard/FoodDashboard/FoodDashboard';
import { TourismDashboard } from './Pages/DashBoard/TourismDashboard/TourismDashboard';
import HealthDashboardLayout from './Pages/DashBoard/HealthDashboard/HealthDashboardLayout.jsx';
// import HealthAdminLogin from './Pages/DashBoard/HealthDashboard/HealthAdminLogin.jsx';

// %%%%%%%%%%% BUSINESSES SECTOR %%%%%%%%%%%
import { BusinessHomePage } from './Pages/BusinessPage/BusinessHomePage/BusinessHomePage';
import { ShopsRetailPg } from './Pages/BusinessPage/BusinessCategoriesPg/ShopsRetailPg';
import { OfficesPg } from './Pages/BusinessPage/BusinessCategoriesPg/OfficesPg';
import { EventsPg } from './Pages/BusinessPage/BusinessCategoriesPg/EventsPg';
import { ManufacturingPg } from './Pages/BusinessPage/BusinessCategoriesPg/ManufacturingPg';
import { FreelancersPg } from './Pages/BusinessPage/BusinessCategoriesPg/FreelancersPg';
import { BusinessAdminLogin } from './Pages/BusinessPage/BusinessAdminLogin';
import { BusinessDashboard } from './Pages/DashBoard/BusinessDashboard/BusinessDashboard';
import { CustomerLogin } from './components/CustomerAuth/CustomerLogin';
import { CustomerDashboard } from './Pages/CustomerDashboard/CustomerDashboard';

// %%%%%%%%%%% FORMS %%%%%%%%%%%
import { TourismRegistration } from './Pages/DashBoard/TourismDashboard/TourismRegistration';
import { AdminLogin } from './Pages/DashBoard/EductionDashboard/EduAdminLgoInForm/EduAdminLogin.jsx';
import { FoodAdminLogin } from './Pages/DashBoard/FoodDashboard/FoodAdminLogin/FoodAdminLogin';
import { SignUpForm } from './components/SignUpForm/SignUpForm';
import { SuperAdminLogin } from './Pages/DashBoard/SuperAdmin/SuprAdminLogIn/SuprAdminLogin.jsx';
import { RegisterUser } from './components/Forms/UserRegistration/RegisterUser.jsx';
import { UserLogin } from './components/Forms/UserLogIn/UserLogin.jsx';
import { HealthAdminLogin } from './Pages/DashBoard/HealthDashboard/HealthAdminLogin/HealthAdminLogin.jsx';


// ================================
// ROUTING SYSTEM
// ================================
const routes = [
  {
    path: "/",
    element: <App />
  },

  {
    path: "/user/register",
    element: <RegisterUser />
  },

  {
    path: "/user/login",
    element: <UserLogin />
  },
  {
    path: "/user/forgot-password",
    element: <ForgotPass type="user" />
  },

  // Authentication / User
  {
    path: "/form",
    element: <SignUpForm />
  },

  {
    path: "/superadmin/dashboard",
    element: <SuperAdminDashboard />
  },

  {
    path: "/superadmin/login",
    element: <SuperAdminLogin />
  },

  // About Us Page
  {
    path: "/AboutUs",
    element: <Aboutus />
  },

  // Contact Us Page 
  {
    path: "/ContactUs",
    element: <Contactus />
  },
  // Education Sector
  {
    path: "/edu",
    element: <EduLayout />,
    children: [
      { index: true, element: <EduHomePage /> },
      { path: "schools", element: <SchoolPage /> },
      { path: "colleges", element: <CollegesPage /> },
      { path: "onlineCourses", element: <OnlineCoursesPage /> },
      { path: "onlineCourses/:id", element: <CourseLandingPage /> },
      { path: "admin", element: <AdminLogin /> },
      { path: "dashboard", element: <SchoolAndClgDashBoard /> },
      { path: "forgot-password", element: <ForgotPass type="admin" /> },
      { path: ":category/:id", element: <SingleLandingPage /> }
    ],
  },

  // Technicians Sector
  {
    path: "/tech",
    element: <TechLayout />,
    children: [
      { index: true, element: <TechniciansHomePg /> },
      { path: "electrical", element: <ElectronicCata /> },
      { path: "plumb-gas", element: <PlumbingGasCata /> },
      { path: "const-paint", element: <PaintingConstructCata /> },
      { path: "carp-furn", element: <CarpFurnitureCata /> },
      { path: "clean-maint", element: <CleanMaintCata /> },
      { path: "gard-outdoor", element: <GardOutdoorCata /> },
    ],
  },

  // Tourism Sector
  {
    path: "/tourism",
    element: <TourismLayout />,
    children: [
      { index: true, element: <TourismHome /> },
      { path: "dashboard", element: <TourismDashboard /> },
      { path: "register", element: <TourismRegistration /> },
      { path: "places", element: <Places /> },
      { path: "hotels", element: <Hotels /> },
      { path: "restaurants", element: <Restaurants /> },
      { path: "parks", element: <Parks /> },

      { path: "guides", element: <TourGuides /> },
      { path: "bazar", element: <Bazar /> },

      { path: "landing", element: <TourismLandingPage /> },
      // Dynamic route for individual service provider
      { path: ":id", element: <TourismLandingPage /> },
    ],
  },

  // Food Sector
  {
    path: "/food",
    element: <FoodLayout />,
    children: [
      { index: true, element: <FoodHomePage /> },
      { path: "fine-dining", element: <FineDiningPage /> },
      { path: "cafes", element: <CafesPage /> },
      { path: "fast-food", element: <FastFoodPage /> },
      { path: "local-food", element: <LocalFoodPage /> },
      { path: "bakeries", element: <BakeriesPage /> },
      { path: "street-food", element: <StreetFoodPage /> },
      { path: "fooddashboard", element: <FoodDashboard /> },
      { path: "admin", element: <FoodAdminLogin /> },
      { path: "forgot-password", element: <ForgotPass type="admin" /> },
    ],
  },

  // Health Sector (New Landing Page)
  {
    path: "/health",
    element: <HealthLayout />,
    children: [
      { index: true, element: <HealthHomePage /> },
      { path: "admin", element: <HealthAdminLogin /> },
      { path: "forgot-password", element: <ForgotPass type="admin" /> },
      { path: "dashboard", element: <HealthDashboardLayout /> },
      { path: "specialists", element: <SpecialistsPage /> },
      { path: "pharmacies", element: <PharmaciesPage /> },
      { path: "specialists/:id", element: <SpecialistsLandingPg /> },
      { path: "pharmacies/:id", element: <PharmaciesLandingPg /> },
      { path: "coming-soon", element: <ComingSoon /> },
    ],
  },


  // Business Sector
  {
    path: "/business",
    element: <BusinessLayout />,
    children: [
      { index: true, element: <BusinessHomePage /> },
      { path: "shops", element: <ShopsRetailPg /> },
      { path: "offices", element: <OfficesPg /> },
      { path: "events", element: <EventsPg /> },
      { path: "manufacturing", element: <ManufacturingPg /> },
      { path: "freelancers", element: <FreelancersPg /> },
      { path: "admin-login", element: <BusinessAdminLogin /> },
      { path: "forgot-password", element: <ForgotPass type="admin" /> },
      {
        path: "dashboard",
        element: <BusinessDashboard />,
        children: [
          {
            path: "track-order",
            element: <CustomerDashboard />
          }
        ]
      },
    ],
  },

  // Page Not Found
  { path: "*", element: <PageNotFoundPg /> },
  {
    path: "/customer/login",
    element: <CustomerLogin />
  },
  {
    path: "/customer/forgot-password",
    element: <ForgotPass type="user" />
  },
  {
    path: "/customer/dashboard",
    element: <CustomerDashboard />
  },
  {
    path: "/api/payfast/return", element: <PageNotFoundPg />
  },
];

const isVercel = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));

const allRoutes = isVercel ? createHashRouter(routes) : createBrowserRouter(routes);

// ================================
// Render App
// ================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <RouterProvider router={allRoutes} />
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </AppProvider>
);
