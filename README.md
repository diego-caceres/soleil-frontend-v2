# Soleil Coding Tool

**A comprehensive visitor behavior coding and analysis platform for science museums and educational institutions.**

Soleil enables researchers and evaluators to systematically observe, record, and analyze visitor interactions with museum exhibits to understand engagement patterns and learning behaviors in informal learning environments.

## 🌟 Overview

Soleil (Sun in French) illuminates visitor behavior patterns through systematic behavioral coding and statistical analysis. The platform supports both live observation and video analysis, providing researchers with powerful tools to understand how visitors engage with museum exhibits and how facilitators can enhance those experiences.

## ✨ Key Features

### 🎯 **Behavioral Coding System**

- **Live Coding**: Real-time observation with built-in timer during actual museum visits
- **Video Coding**: Frame-by-frame analysis of pre-recorded visitor interactions
- **Dual Actor Tracking**: Separate behavior tracking for visitors and facilitators

### 👥 **Comprehensive Visitor Profiling**

- Demographics (gender, age range, group size)
- Background (education level, museum familiarity, visitor type)
- Contextual factors (language, special conditions, visit day status)

### 📊 **Behavioral Classification Framework**

#### Visitor Engagement Levels:

- **Initiation**: Basic interaction (doing/observing activities)
- **Transition**: Deeper engagement (repeating activities, positive responses)
- **Breakthrough**: Advanced engagement (sharing, seeking information, deep involvement)

#### Facilitator Behavior Categories:

- **Comfort**: Building rapport and encouraging participation
- **Information**: Providing context, explanations, and facts
- **Exhibit Use**: Demonstrating features and providing technical assistance
- **Reflection**: Making connections and inviting deeper thinking

### 📈 **Advanced Analytics**

- **Inter-Rater Reliability**: Cohen's Kappa calculation with visual indicators
- **Visitor Engagement Profile (VEP)**: Comparative analysis between groups
- **Statistical Testing**: Chi-squared and Kendall's Tau correlation analysis
- **Interactive Visualizations**: Dynamic charts for engagement distribution

### 💾 **Data Management**

- Cloud-based storage with Firebase
- CSV export functionality
- Multi-evaluator support with filtering
- Historical coding review and management

## 🛠️ Technology Stack

### Frontend

- **React 17.0.2** - Modern UI framework with hooks
- **Redux Toolkit** - Centralized state management
- **React Router 6** - Navigation and routing
- **SCSS/Sass** - Advanced styling

### Visualization & Analysis

- **@nivo/bar** - Interactive data visualizations
- **statistics.js** - Statistical analysis calculations
- **react-csv** - Data export capabilities

### Media & Interaction

- **react-player** - Precise video playback controls
- **react-timer-hook** - Real-time behavioral timing
- **react-select** - Enhanced form controls

### Backend Services

- **Firebase 9.21.0** (Firestore + Auth) - Cloud database and authentication
- **Node.js API** - Backend services for complex data processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd soleil-frontend-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase configuration to `src/config/firebase.js`

4. **Start development server**

   ```bash
   npm start
   # or
   yarn start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- **`npm start`** - Runs the development server
- **`npm test`** - Launches the test runner
- **`npm run build`** - Builds the app for production
- **`npm run lint`** - Run ESLint to check for code issues

## 📱 Application Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── CodingLive/        # Live behavioral coding
│   ├── CodingVideo/       # Video-based coding
│   ├── CodingsList/       # Historical coding management
│   ├── EngagementChart/   # Data visualization and analytics
│   ├── InterCoder/        # Inter-rater reliability analysis
│   └── DownloadDataPage/  # Data export functionality
├── config/
│   └── firebase.js        # Firebase configuration
├── redux/
│   ├── behaviors.js       # Behavior taxonomy state
│   ├── codings.js         # Coding sessions state
│   ├── exhibits.js        # Exhibit information state
│   └── store.js           # Redux store configuration
└── utils.js               # Utility functions and calculations
```

## 🔄 Usage Workflow

1. **Authentication**: Log in with authorized researcher credentials
2. **Exhibit Selection**: Choose the museum exhibit to observe
3. **Behavioral Coding**:
   - **Live Mode**: Start timer and code behaviors in real-time
   - **Video Mode**: Load video file and code frame-by-frame
4. **Data Collection**: Record visitor demographics and facilitator interactions
5. **Analysis**: Generate engagement profiles and statistical comparisons
6. **Export**: Download data in CSV format for further analysis

## 📊 Research Applications

- **Museum Evaluation Research**: Systematic assessment of exhibit effectiveness
- **Learning Behavior Analysis**: Understanding visitor engagement patterns
- **Facilitator Training**: Analyzing staff interaction effectiveness
- **Exhibit Design Optimization**: Data-driven design improvements
- **Academic Research**: Quantitative behavioral analysis in informal learning

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or feature requests, please create an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- Science museum professionals and researchers who provided valuable feedback
- The informal learning research community
- Firebase and React development teams for excellent documentation

---

**Built with ❤️ for the science museum and informal learning research community**
