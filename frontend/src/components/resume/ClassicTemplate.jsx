import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Open Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Open Sans',
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#0F2744',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#0F2744',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#0D9488',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 8,
        paddingBottom: 2,
        textTransform: 'uppercase',
    },
    item: {
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#1F2937',
    },
    itemSubtitle: {
        fontSize: 10,
        color: '#4B5563',
        marginBottom: 2,
    },
    text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.5,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillBadge: {
        backgroundColor: '#F0FDFA',
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 9,
        color: '#0F766E',
        border: '1px solid #CCFBF1',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 9,
        color: '#6B7280',
    },
});

const ResumeTemplate = ({ user, projects, internships, education, skills, certificates }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{user?.name || 'Student Name'}</Text>
                <Text style={styles.subtitle}>{user?.email} | {user?.phone || 'Phone Not Added'}</Text>
                <Text style={styles.subtitle}>
                    {user?.linkedin ? `LinkedIn: ${user.linkedin}` : ''}
                    {user?.linkedin && user?.github ? ' | ' : ''}
                    {user?.github ? `GitHub: ${user.github}` : ''}
                </Text>
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.item}>
                    <View style={styles.row}>
                        <Text style={styles.itemTitle}>{user?.branch || 'Branch Name'}</Text>
                        <Text style={styles.date}>Year: {user?.year || 'N/A'}</Text>
                    </View>
                    <Text style={styles.itemSubtitle}>CGPA: {user?.cgpa || 'N/A'}</Text>
                </View>
            </View>

            {/* Skills */}
            {skills && skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsContainer}>
                        {skills.map((skill, index) => (
                            <Text key={index} style={styles.skillBadge}>
                                {skill.name} ({skill.level})
                            </Text>
                        ))}
                    </View>
                </View>
            )}

            {/* Internships */}
            {internships && internships.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Internships</Text>
                    {internships.map((internship, index) => (
                        <View key={index} style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.itemTitle}>{internship.company}</Text>
                                <Text style={styles.date}>
                                    {new Date(internship.startDate).toLocaleDateString()} -
                                    {internship.current ? 'Present' : new Date(internship.endDate).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text style={styles.itemSubtitle}>{internship.role}</Text>
                            <Text style={styles.text}>{internship.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {projects.map((project, index) => (
                        <View key={index} style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.itemTitle}>{project.title}</Text>
                                <Text style={styles.itemSubtitle}>
                                    {project.technologies?.join(', ')}
                                </Text>
                            </View>
                            <Text style={styles.text}>{project.description}</Text>
                            {project.link && (
                                <Text style={[styles.text, { color: '#0D9488', fontSize: 9 }]}>
                                    Link: {project.link}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Certificates */}
            {certificates && certificates.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {certificates.map((cert, index) => (
                        <View key={index} style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.itemTitle}>{cert.name}</Text>
                                <Text style={styles.date}>{new Date(cert.date).toLocaleDateString()}</Text>
                            </View>
                            <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Page>
    </Document>
);

export default ResumeTemplate;
