import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Open Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Open Sans', color: '#000' },
    header: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
    name: { fontSize: 24, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' },
    contactParams: { flexDirection: 'row', gap: 10, fontSize: 9 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 },
    itemMain: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    itemTitle: { fontWeight: 700 },
    itemSubtitle: { fontStyle: 'italic' },
    itemDesc: { lineHeight: 1.4 },
    skillList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});

const MinimalTemplate = ({ user, projects, internships, education, skills }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{user?.name}</Text>
                <View style={styles.contactParams}>
                    <Text>{user?.email}</Text>
                    <Text>•</Text>
                    <Text>{user?.phone}</Text>
                    {user?.linkedin && <><Text>•</Text><Text>LinkedIn: {user.linkedin.split('/').pop()}</Text></>}
                    {user?.github && <><Text>•</Text><Text>GitHub: {user.github.split('/').pop()}</Text></>}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={{ marginBottom: 6 }}>
                    <View style={styles.itemMain}>
                        <Text style={styles.itemTitle}>{user?.branch}</Text>
                        <Text>{user?.year ? `Year: ${user.year}` : ''}</Text>
                    </View>
                    <Text>CGPA: {user?.cgpa}</Text>
                </View>
            </View>

            {skills && skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                    <View style={styles.skillList}>
                        <Text>{skills.map(s => s.name).join(' • ')}</Text>
                    </View>
                </View>
            )}

            {internships && internships.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {internships.map((int, i) => (
                        <View key={i} style={{ marginBottom: 8 }}>
                            <View style={styles.itemMain}>
                                <Text style={styles.itemTitle}>{int.company}</Text>
                                <Text>{new Date(int.startDate).getFullYear()} - {int.current ? 'Pres' : new Date(int.endDate).getFullYear()}</Text>
                            </View>
                            <Text style={[styles.itemSubtitle, { marginBottom: 2 }]}>{int.role}</Text>
                            <Text style={styles.itemDesc}>{int.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {projects && projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Projects</Text>
                    {projects.map((proj, i) => (
                        <View key={i} style={{ marginBottom: 8 }}>
                            <View style={styles.itemMain}>
                                <Text style={styles.itemTitle}>{proj.title}</Text>
                            </View>
                            {proj.technologies && (
                                <Text style={{ fontSize: 9, color: '#444', marginBottom: 2 }}>{proj.technologies.join(', ')}</Text>
                            )}
                            <Text style={styles.itemDesc}>{proj.description}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Page>
    </Document>
);

export default MinimalTemplate;
