# NLP2SQL - React Frontend Migration

This project has been migrated from Streamlit to a modern React frontend with Node.js/Express backend while maintaining all the original functionalities.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Python 3.8+ (for original Python services)

### Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

The React app will run on `http://localhost:3000`

### Backend Setup (Node.js/Express)

```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API keys and configuration

npm run dev
```

The backend API will run on `http://localhost:5000`

## 📁 Project Structure

```
NLP2SQL/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── routes/              # API routes
│   ├── services/            # Business logic services
│   ├── utils/               # Backend utilities
│   └── package.json
├── app/                     # Original Streamlit app (preserved)
├── src/                     # Original Python modules (preserved)
└── data/                    # Sample data
```

## ✨ New Features

### React Frontend
- **Modern UI**: Material-UI components with dark theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and loading states
- **Enhanced Visualizations**: Interactive charts with Recharts
- **File Upload**: Drag & drop database file upload
- **Query History**: Persistent query history with search
- **Export Options**: CSV, JSON export functionality

### Node.js Backend
- **RESTful API**: Clean API endpoints for all operations
- **Security**: SQL injection prevention, input validation
- **Error Handling**: Comprehensive error handling and logging
- **File Management**: Secure file upload and processing
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Proper cross-origin resource sharing

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# LLM Provider (AZURE or GEMINI)
LLM_PROVIDER=AZURE

# Azure OpenAI
OPENAI_ENDPOINT=https://[ENDPOINT_NAME].openai.azure.com
OPENAI_API_KEY=your_azure_openai_key
MODEL_NAME=your_model_name

# Gemini (alternative)
GEMINI_API_KEY=your_gemini_key

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🛠️ Available Scripts

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 📊 Features Maintained

All original Streamlit functionalities have been preserved:

- ✅ Natural Language to SQL conversion
- ✅ Multi-database support (SQLite, PostgreSQL)
- ✅ Interactive data visualization
- ✅ Query history and management
- ✅ Decision log display
- ✅ Summary statistics
- ✅ Data export capabilities
- ✅ Schema exploration
- ✅ Query validation and security

## 🔒 Security Features

- SQL injection prevention
- Input validation and sanitization
- File upload restrictions
- Rate limiting
- CORS protection
- Secure error handling

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Docker Support (Coming Soon)

Docker configurations will be added for easy deployment.

## 🤝 Migration Benefits

- **Better Performance**: React frontend is faster and more responsive
- **Modern Architecture**: Separation of concerns with API-first design
- **Scalability**: Independent frontend/backend scaling
- **Maintainability**: Cleaner codebase with modern technologies
- **Mobile Support**: Responsive design works on all devices
- **Developer Experience**: Hot reloading, better debugging tools

## 📝 API Documentation

### Endpoints

- `POST /api/database/upload-database` - Upload SQLite file
- `POST /api/database/schemas` - Get database schemas
- `POST /api/database/execute-query` - Execute SQL query
- `POST /api/query/generate-query` - Generate SQL from natural language
- `POST /api/export/results` - Export query results

See individual route files for detailed API documentation.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running on port 5000
2. **API Connection**: Check REACT_APP_API_URL in frontend .env
3. **File Upload**: Verify file size limits and allowed extensions
4. **Database Connection**: Check PostgreSQL credentials

### Development Tips

- Use browser dev tools for frontend debugging
- Check backend console logs for API issues
- Verify environment variables are properly set
- Ensure all dependencies are installed

## 📄 License

This project maintains the same license as the original NLP2SQL project.

## 🙏 Acknowledgments

Built upon the original NLP2SQL Streamlit application, maintaining all core functionalities while modernizing the technology stack.
