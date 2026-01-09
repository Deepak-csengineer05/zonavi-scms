import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Trophy, Medal, Award } from 'lucide-react';

const Rankings = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('score');

    useEffect(() => { fetchRankings(); }, [sortBy]);

    const fetchRankings = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getRankings({ sortBy, limit: 50 });
            setRankings(data);
        } catch (error) {
            console.error('Failed to fetch rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"><Trophy className="w-4 h-4 text-white" /></div>;
        if (rank === 2) return <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center"><Medal className="w-4 h-4 text-white" /></div>;
        if (rank === 3) return <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>;
        return <div className="w-8 h-8 bg-soft-300 dark:bg-navy-600 rounded-full flex items-center justify-center text-sm font-medium text-soft-600 dark:text-soft-400">{rank}</div>;
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">Student Rankings</h1>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto">
                    <option value="score">By Career Score</option>
                    <option value="cgpa">By CGPA</option>
                </select>
            </div>

            {/* Top 3 Podium */}
            {rankings.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* 2nd Place */}
                    <div className="card text-center mt-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-3">
                            <span className="text-white text-2xl font-bold">2</span>
                        </div>
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
                            {rankings[1]?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-navy-800 dark:text-soft-100">{rankings[1]?.name}</h3>
                        <p className="text-sm text-soft-600 dark:text-soft-400">{rankings[1]?.branch}</p>
                        <div className="mt-2 flex justify-center gap-2">
                            <span className="badge badge-teal">{rankings[1]?.cgpa?.toFixed(2)} CGPA</span>
                            <span className="badge badge-primary">{rankings[1]?.careerScore} pts</span>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="card text-center bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-navy-700 border-2 border-yellow-400">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {rankings[0]?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 className="font-bold text-lg text-navy-800 dark:text-soft-100">{rankings[0]?.name}</h3>
                        <p className="text-sm text-soft-600 dark:text-soft-400">{rankings[0]?.branch}</p>
                        <div className="mt-2 flex justify-center gap-2">
                            <span className="badge badge-teal">{rankings[0]?.cgpa?.toFixed(2)} CGPA</span>
                            <span className="badge badge-primary">{rankings[0]?.careerScore} pts</span>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="card text-center mt-12">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-3">
                            <span className="text-white text-xl font-bold">3</span>
                        </div>
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2">
                            {rankings[2]?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-navy-800 dark:text-soft-100">{rankings[2]?.name}</h3>
                        <p className="text-sm text-soft-600 dark:text-soft-400">{rankings[2]?.branch}</p>
                        <div className="mt-2 flex justify-center gap-2">
                            <span className="badge badge-teal">{rankings[2]?.cgpa?.toFixed(2)} CGPA</span>
                            <span className="badge badge-primary">{rankings[2]?.careerScore} pts</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Rankings Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-soft-200 dark:bg-navy-600">
                            <tr>
                                <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Rank</th>
                                <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Student</th>
                                <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Branch</th>
                                <th className="text-center p-4 font-medium text-navy-700 dark:text-soft-200">CGPA</th>
                                <th className="text-center p-4 font-medium text-navy-700 dark:text-soft-200">Career Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-soft-300 dark:divide-navy-600">
                            {rankings.map((student) => (
                                <tr key={student._id} className={`hover:bg-soft-100 dark:hover:bg-navy-600/50 transition-colors ${student.rank <= 3 ? 'bg-soft-50 dark:bg-navy-600/30' : ''}`}>
                                    <td className="p-4">{getRankBadge(student.rank)}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {student.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-navy-800 dark:text-soft-100">{student.name}</p>
                                                <p className="text-sm text-soft-600 dark:text-soft-400">@{student.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-soft-600 dark:text-soft-400">{student.branch || '-'}</td>
                                    <td className="p-4 text-center"><span className="badge badge-teal">{student.cgpa?.toFixed(2) || '0.00'}</span></td>
                                    <td className="p-4 text-center"><span className="badge badge-primary font-bold">{student.careerScore || 0}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Rankings;
