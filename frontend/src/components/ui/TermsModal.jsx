import { X, Shield, FileText, Scale, AlertCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, type = 'student' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-navy-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-navy-600 flex items-center justify-between bg-gray-50 dark:bg-navy-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                            <Scale className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-navy-900 dark:text-white">Terms of Service</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AGREEMENT BETWEEN USER AND ZONAVI</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-navy-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-lg border border-teal-100 dark:border-teal-900/20 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <p className="text-teal-800 dark:text-teal-200 font-medium">
                            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the ZONAVI platform operated by our institution. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                        </p>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            1. Acceptance of Agreement
                        </h3>
                        <p>
                            By creating an account, accessing, or using the ZONAVI platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This agreement serves as a binding legal contract between you and ZONAVI.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            2. {type === 'employer' ? 'Employer' : 'Student'} Code of Conduct & Responsibilities
                        </h3>
                        {type === 'employer' ? (
                            <>
                                <p className="mb-2">As an Employer on ZONAVI, you agree to:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Verification:</strong> You represent and warrant that you are an authorized representative of the entity you are registering and have the authority to bind the entity to these Terms.</li>
                                    <li><strong>Accuracy of Postings:</strong> Ensure all job postings are current, accurate, and represent bona fide employment or internship opportunities. Multi-level marketing (MLM) or "get rich quick" schemes are strictly prohibited.</li>
                                    <li><strong>Non-Discrimination:</strong> Adhere to all applicable labor laws and regulations. You shall not discriminate against any applicant on the basis of race, color, religion, gender, sexual orientation, national origin, age, or disability.</li>
                                    <li><strong>Data Usage:</strong> Use candidate information solely for the purpose of recruitment. Selling, distributing, or using candidate data for marketing purposes is a material breach of this agreement.</li>
                                    <li><strong>Professionalism:</strong> Maintain professional communication with candidates at all times. Harassment or inappropriate conduct will result in immediate account termination.</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p className="mb-2">As a Student on ZONAVI, you agree to:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Integrity of Information:</strong> Provide strictly accurate, current, and complete information in your profile, resume, and application materials. Falsifying academic records (CGPA, backlogs, year of passing) or skills is a violation of university policy and these Terms.</li>
                                    <li><strong>Interview Attendance:</strong> If shortlisted, you are obligated to attend scheduled interviews and selection processes. Unexcused absenteeism reflects poorly on the institution and may result in debarment from future placement drives.</li>
                                    <li><strong>One Offer Policy:</strong> Adhere to the institution's "One Student, One Offer" policy where applicable. Once an offer is accepted, you may be restricted from applying to further opportunities to ensure equitable distribution of offers.</li>
                                    <li><strong>Professional Conduct:</strong> Maintain professional decorum in all interactions with employers, including messaging, interviews, and on-site visits.</li>
                                    <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials. You agree not to share your account with anyone else.</li>
                                </ul>
                            </>
                        )}
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            3. Privacy & Data Collection
                        </h3>
                        <p>
                            Your privacy is paramount. We collect, use, and process your personal data as described in our Privacy Policy. By using the Service, you consent to such processing and you warrant that all data provided by you is accurate.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Visibility:</strong> {type === 'employer' ? 'Your profile and job postings are visible to verified students and administrators.' : 'Your profile, resume, and academic data are visible to verified employers and administrators for recruitment purposes.'}</li>
                            <li><strong>Cookies:</strong> We use cookies to enhance your experience and analyze platform usage.</li>
                            <li><strong>Third Parties:</strong> We do not sell your personal data. Data is shared with employers/candidates only to facilitate the hiring process.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            4. Intellectual Property Rights
                        </h3>
                        <p>
                            Usage of the ZONAVI platform does not grant you ownership of any content, code, data, or materials you may access on or through the Platform. All original content, features, and functionality are and will remain the exclusive property of ZONAVI and its licensors. The ZONAVI name and logo are trademarks of the institution.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            5. Limitation of Liability
                        </h3>
                        <p>
                            To the maximum extent permitted by law, ZONAVI and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            6. Termination
                        </h3>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            7. Governing Law & Jurisdiction
                        </h3>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 uppercase tracking-wide">
                            8. Changes to Terms
                        </h3>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <div className="pt-6 mt-4 text-xs text-center text-gray-400 border-t border-gray-200 dark:border-navy-600">
                        <p>Use of this platform constitutes acceptance of these Terms of Service.</p>
                        <p>&copy; {new Date().getFullYear()} ZONAVI Career Management System. All Rights Reserved.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-900/50 rounded-b-2xl flex justify-between items-center gap-3">
                    <div className="text-xs text-gray-500 hidden sm:block">
                        Please scroll to read the full agreement
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn bg-white dark:bg-navy-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-navy-600 font-medium px-6"
                        >
                            Decline
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-primary px-8 shadow-lg shadow-teal-500/20"
                        >
                            I Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
