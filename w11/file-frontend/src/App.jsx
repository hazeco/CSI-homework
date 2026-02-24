import './App.css'
import Download from './components/Dowload'
import Upload from './components/Upload'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4 md:px-8">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">File Manager</h1>
          <p className="text-slate-500 mt-2 text-sm">Upload and download your files easily</p>
        </div>

        {/* Mobile (flex-col): Download top, Upload bottom */}
        {/* PC md+ (flex-col-reverse): Upload top, Download bottom */}
        <div className="flex flex-col md:flex-col-reverse gap-6">
          <Download />
          <Upload />
        </div>
      </div>
    </div>
  )
}

export default App
