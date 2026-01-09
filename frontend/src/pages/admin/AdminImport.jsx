import { useState } from 'react';
import { adminAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminImport = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null); // { success: 10, failed: 2 }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast.error('Please upload a valid CSV file');
                return;
            }
            setFile(selectedFile);
            parseCSV(selectedFile);
            setStats(null);
        }
    };

    const parseCSV = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            const data = [];

            // Simple parser: check for name, email, branch header
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length === headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                        // Normalize headers
                        const key = header.toLowerCase().replace(/[\s"']/g, '');
                        row[key] = values[index];
                    });
                    data.push(row);
                }
            }
            setPreviewData(data.slice(0, 5)); // Preview first 5
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // Parse full data again or store from preview if small
                // For robustness, let's parse fully here
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[\s"']/g, ''));
                const students = [];

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    const values = lines[i].split(',').map(v => v.trim());
                    const student = {};
                    headers.forEach((h, idx) => student[h] = values[idx]);

                    // Basic validation
                    if (student.name && student.email) {
                        students.push(student);
                    }
                }

                if (students.length === 0) {
                    toast.error('No valid student data found');
                    setLoading(false);
                    return;
                }

                const { data } = await adminAPI.importStudents({ students });
                setStats(data);
                toast.success(`Processed! Success: ${data.success}, Failed: ${data.failed}`);
                setFile(null);
                setPreviewData([]);
            } catch (error) {
                console.error('Import failed:', error);
                toast.error(error.response?.data?.message || 'Import failed');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const headers = ['Name', 'Email', 'Phone', 'Branch', 'Year', 'RegisterNumber'];
        const sample = ['John Doe,john@example.com,9876543210,CSE,4,727622BCS100'];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + sample.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PageWrapper>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Bulk Import Students</h1>
                    <p className="text-soft-600 dark:text-soft-400">Add multiple students at once via CSV</p>
                </div>
                <button onClick={downloadTemplate} className="btn btn-outline flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Template
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div className="card">
                    <h2 className="section-title mb-4">Upload File</h2>
                    <div className="border-2 border-dashed border-soft-300 dark:border-navy-600 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-teal-500 transition-colors bg-soft-50 dark:bg-navy-900/50">
                        <Upload className="w-12 h-12 text-soft-400 mb-4" />
                        <p className="font-medium text-navy-800 dark:text-white mb-2">
                            {file ? file.name : 'Drag & drop or browse CSV'}
                        </p>
                        <p className="text-sm text-soft-500 mb-6">Supported format: .csv</p>

                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <div className="flex gap-2">
                            <label
                                htmlFor="csv-upload"
                                className="btn btn-secondary cursor-pointer"
                            >
                                Browse Files
                            </label>
                            {file && (
                                <button onClick={() => { setFile(null); setPreviewData([]); setStats(null); }} className="btn btn-danger p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {file && (
                        <div className="mt-6">
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="btn btn-primary w-full flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ChecksCircle className="w-5 h-5" />}
                                {loading ? 'Processing...' : `Import ${previewData.length > 0 ? '(Preview Loaded)' : ''}`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results / Stats */}
                <div className="space-y-6">
                    {stats && (
                        <div className="card bg-gradient-to-br from-white to-soft-100 dark:from-navy-800 dark:to-navy-900">
                            <h2 className="section-title mb-4">Import Results</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                    <div className="text-green-600 dark:text-green-400 font-bold text-2xl">{stats.success}</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">Successfully Added</div>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                    <div className="text-red-600 dark:text-red-400 font-bold text-2xl">{stats.failed}</div>
                                    <div className="text-sm text-red-700 dark:text-red-300">Failed / Duplicates</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Table */}
                    {previewData.length > 0 && !stats && (
                        <div className="card">
                            <h2 className="section-title mb-4 flex items-center justify-between">
                                <span>Preview</span>
                                <span className="text-xs font-normal text-soft-500">First 5 rows</span>
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-soft-100 dark:bg-navy-700 uppercase text-xs font-bold text-soft-600 dark:text-soft-300">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-md">Name</th>
                                            <th className="px-3 py-2">Email</th>
                                            <th className="px-3 py-2 rounded-r-md">Branch</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-soft-200 dark:divide-navy-700">
                                        {previewData.map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2">{row.name}</td>
                                                <td className="px-3 py-2 font-mono text-xs">{row.email}</td>
                                                <td className="px-3 py-2">{row.branch}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!file && !stats && (
                        <div className="card h-full flex flex-col items-center justify-center text-center text-soft-500 opacity-60">
                            <FileText className="w-16 h-16 mb-4" />
                            <p>Upload a file to see preview</p>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

// Fix for icon usage (CheckCircle was typo'd as ChecksCircle in button)
const ChecksCircle = CheckCircle;

export default AdminImport;
