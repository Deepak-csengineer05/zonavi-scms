import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (same as original)
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
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Open Sans',
    },
    sidebar: {
        width: '30%',
        backgroundColor: '#f0f4f8',
        padding: 20,
        height: '100%',
    },
    main: {
        width: '70%',
        padding: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: 700,
        color: '#1a202c',
        marginBottom: 5,
    },
    role: {
        fontSize: 12,
        color: '#0d9488',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sidebarSection: {
        marginBottom: 20,
    },
    sidebarTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#4a5568',
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e0',
        marginBottom: 10,
        paddingBottom: 4,
        textTransform: 'uppercase',
    },
    contactItem: {
        fontSize: 9,
        color: '#4a5568',
        marginBottom: 6,
    },
    skillItem: {
        fontSize: 9,
        color: '#2d3748',
        marginBottom: 4,
        padding: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2d3748',
        borderBottomWidth: 2,
        borderBottomColor: '#0d9488',
        marginBottom: 15,
        paddingBottom: 5,
        textTransform: 'uppercase',
    },
    item: {
        marginBottom: 15,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#2d3748',
    },
    itemDate: {
        fontSize: 10,
        color: '#718096',
        fontStyle: 'italic',
    },
    itemSubtitle: {
        fontSize: 10,
        color: '#0d9488',
        marginBottom: 4,
        fontWeight: 600,
    },
    description: {
        fontSize: 10,
        color: '#4a5568',
        lineHeight: 1.6,
    },
});

const ModernTemplate = ({ user, projects, internships, education, skills, certificates }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Sidebar Left */}
            <View style={styles.sidebar}>
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>Contact</Text>
                    <Text style={styles.contactItem}>{user?.email}</Text>
                    <Text style={styles.contactItem}>{user?.phone}</Text>
                    {user?.location && <Text style={styles.contactItem}>{user?.location}</Text>}
                    {user?.linkedin && <Text style={styles.contactItem}>LinkedIn: {user.linkedin.split('/').pop()}</Text>}
                    {user?.github && <Text style={styles.contactItem}>GitHub: {user.github.split('/').pop()}</Text>}
                </View>

                {education && (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Education</Text>
                        <Text style={{ fontSize: 10, fontWeight: 700 }}>{user?.branch}</Text>
                        <Text style={{ fontSize: 9, color: '#718096', marginBottom: 2 }}>{user?.year ? `Year ${user.year}` : ''}</Text>
                        {user?.cgpa && <Text style={{ fontSize: 9, color: '#0d9488' }}>CGPA: {user.cgpa}</Text>}
                    </View>
                )}

                {skills && skills.length > 0 && (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Skills</Text>
                        {skills.map((skill, index) => (
                            <Text key={index} style={styles.skillItem}>
                                {skill.name}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            {/* Main Content Right */}
            <View style={styles.main}>
                <View style={{ marginBottom: 30 }}>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.role}>{user?.branch || 'Student'}</Text>
                    {user?.bio && <Text style={styles.description}>{user.bio}</Text>}
                </View>

                {internships && internships.length > 0 && (
                    <View style={styles.item}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {internships.map((internship, index) => (
                            <View key={index} style={{ marginBottom: 12 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{internship.company}</Text>
                                    <Text style={styles.itemDate}>
                                        {new Date(internship.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                        {internship.current ? 'Present' : new Date(internship.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{internship.role}</Text>
                                <Text style={styles.description}>{internship.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {projects && projects.length > 0 && (
                    <View style={styles.item}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((project, index) => (
                            <View key={index} style={{ marginBottom: 12 }}>
                                <Text style={styles.itemTitle}>{project.title}</Text>
                                {project.technologies && (
                                    <Text style={[styles.description, { color: '#0d9488', marginBottom: 2 }]}>
                                        {project.technologies.join(' • ')}
                                    </Text>
                                )}
                                <Text style={styles.description}>{project.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

export default ModernTemplate;
