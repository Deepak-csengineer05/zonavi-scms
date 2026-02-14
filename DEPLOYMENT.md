    # Deployment Guide: SCMS MERN Project

    This guide will walk you through hosting your Student Career Management System for public use using **MongoDB Atlas** (Database), **Render** (Backend), and **Vercel** (Frontend).

    ---

    ## 📋 Prerequisites

    1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
    2.  **Accounts**:
        *   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
        *   [Render](https://render.com/)
        *   [Vercel](https://vercel.com/)

    ---

    ## 🗄️ Step 1: Database Setup (MongoDB Atlas)

    Since you cannot use `localhost` in the cloud, you need a cloud database.

    1.  **Create a Cluster**: Log in to MongoDB Atlas and create a free Shared Cluster (M0 Sandbox).
    2.  **Create a Database User**:
        *   Go to **Database Access** -> **Add New Database User**.
        *   Create a user (e.g., `scms_admin`) and password. **Save this password**.
    3.  **Allow Network Access**:
        *   Go to **Network Access** -> **Add IP Address**.
        *   Select **Allow Access from Anywhere** (`0.0.0.0/0`). This allows Render to connect.
    4.  **Get Connection String**:
        *   Go to **Database** -> **Connect** -> **Drivers**.
        *   Copy the connection string. It looks like:
            `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

    > [!NOTE]
    > You will need to replace `<password>` with your actual database password later.

    ---

    ## 🚀 Step 2: Backend Deployment (Render)

    We will host the Node.js/Express backend on Render using their free tier.

    1.  **New Web Service**:
        *   Log in to Render dashboard.
        *   Click **New +** -> **Web Service**.
        *   Connect your GitHub repository.
    2.  **Configure Service**:
        *   **Name**: `scms-backend` (or unique name)
        *   **Root Directory**: `backend` (Important! Since your backend is in a subfolder)
        *   **Runtime**: `Node`
        *   **Build Command**: `npm install`
        *   **Start Command**: `node server.js`
        *   **Free Instance Type**: Select "Free".
    3.  **Environment Variables**:
        *   Scroll down to **Environment Variables** and add the following:

        | Key | Value |
        | :--- | :--- |
        | `NODE_ENV` | `production` |
        | `MONGODB_URI` | Your Atlas connection string (replace `<password>`!) |
        | `JWT_SECRET` | A long, secure random string |
        | `PORT` | `10000` (Render creates this automatically, but good to know) |
        | `FRONTEND_URL` | `*` (Temporarily allow all, we will update this to your Vercel URL later) |

    4.  **Deploy**: Click **Create Web Service**.
        *   Wait for the deployment to finish.
        *   **Copy your Backend URL** from the top left (e.g., `https://scms-backend.onrender.com`).

    > [!WARNING]
    > **Ephemeral Storage**: On Render's free tier, the disk is ephemeral. This means files uploaded to `/uploads` will disappear when the server restarts (which happens frequently on free tier). For persistent production storage, consider integrating **Cloudinary** or **AWS S3** in the future.

    ---

    ## 🌐 Step 3: Frontend Deployment (Vercel)

    Now we host the React frontend on Vercel.

    1.  **New Project**:
        *   Log in to Vercel.
        *   Click **Add New...** -> **Project**.
        *   Import your GitHub repository.
    2.  **Configure Project**:
        *   **Framework Preset**: Vite (should be auto-detected).
        *   **Root Directory**: Click "Edit" and select `frontend`.
    3.  **Environment Variables**:
        *   Expand the **Environment Variables** section.
        *   Add the following:

        | Key | Value |
        | :--- | :--- |
        | `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

        > **Important**: Ensure you append `/api` to the end of your Render backend URL.

    4.  **Deploy**: Click **Deploy**.
        *   Vercel will build and deploy your site.
        *   Once done, **Copy your Frontend URL** (e.g., `https://scms-frontend.vercel.app`).

    ---

    ## 🔗 Step 4: Final Configuration

    Secure your backend by allowing only your Vercel frontend to access it.

    1.  Go back to **Render Dashboard** -> **Environment**.
    2.  Edit the `FRONTEND_URL` variable.
    3.  Set it to your Vercel URL (e.g., `https://scms-frontend.vercel.app`). Do not add trailing slash.
    4.  **Save Changes** (This will trigger a redeploy of the backend).

    ---

    ## ✅ Verification

    1.  Open your Vercel URL.
    2.  Try to **Register** a new account (tests DB connection).
    3.  Try to **Login** (tests JWT).
    4.  Upload a profile picture (tests Uploads - remember the warning about persistence).

    Your MERN stack project is now live! 🚀
