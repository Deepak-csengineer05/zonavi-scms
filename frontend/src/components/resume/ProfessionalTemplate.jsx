import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';

// Using Standard Times-Roman font which is built-in to PDF viewers (no registration needed usually, or standard)
// If needed we can register a specific font, but Times-Roman is standard for this look.

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 10,
        lineHeight: 1.4,
        color: '#000000',
    },
    // Header
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Times-Bold',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
        fontSize: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    link: {
        color: '#0000EE', // Standard blue link color
        textDecoration: 'none',
    },
    icon: {
        width: 10,
        height: 10,
    },

    // Sections
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        marginBottom: 8,
        paddingBottom: 2,
    },

    // Content
    paragraph: {
        marginBottom: 4,
        textAlign: 'justify',
    },

    // Lists & Items
    item: {
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    itemTitle: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
    },
    itemSubtitle: {
        fontFamily: 'Times-Italic',
    },
    itemDate: {
        fontFamily: 'Times-Roman', // Regular
    },
    bulletPoint: {
        flexDirection: 'row',
        marginLeft: 10,
        marginBottom: 2,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
    },

    // Skills
    skillRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillLabel: {
        fontFamily: 'Times-Bold',
        width: 120,
    },
    skillValue: {
        flex: 1,
    }
});

// Iconic Paths
const Icons = {
    Phone: "M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z",
    Mail: "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.703 2.82 4.703 2.625V5.383zM1 8.83v-3.447l4.703 2.82L1 10.828zm2.267 2.08L7.05 9.875 1.55 13.09C1.685 13.097 1.83 13.1 2 13.1h12c.169 0 .315-.003.45-.01l-5.5-3.216 1.783-1.07L16 13.92v-3.09l-4.703-2.625L16 5.383v7.697l-2.733-1.573z", // Simplified mail
    Linkedin: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54 1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z",
    Github: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
};

const Icon = ({ path }) => (
    <Svg width={10} height={10} viewBox="0 0 16 16" style={{ marginRight: 4 }}>
        <Path d={path} fill="#000" />
    </Svg>
);

const ProfessionalTemplate = ({ user, projects, internships, education, skills, certificates }) => {
    // Helper to format tech stack
    const formatTech = (tech) => tech ? tech.join(', ') : '';
    const cleanLink = (url) => url ? url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';

    // Fallback data mapping since user model is simple
    const userEducation = user ? [{
        school: 'Karpagam College of Engineering, Coimbatore', // Mocking based on sample if user field is missing
        degree: user.branch ? `B.E., ${user.branch}` : 'Bachelor of Engineering',
        date: user.year ? `Present` : '2023 - 2027',
        grade: user.cgpa ? `CGPA: ${user.cgpa}` : ''
    }] : [];

    // Since we can't get the *exact* school name from the current simple `user` model (which only has branch/year),
    // we will rely on what we have or generic placeholders if empty.
    // Ideally, we'd update the profile form to accept "School Name".
    // For now, I will display "University/College Name" if not present.

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{user?.name || 'Your Name'}</Text>
                    <View style={styles.contactRow}>
                        {user?.phone && (
                            <View style={styles.contactItem}>
                                <Icon path={Icons.Phone} />
                                <Link src={`tel:${user.phone}`} style={styles.link}>{user.phone}</Link>
                            </View>
                        )}
                        {user?.email && (
                            <View style={styles.contactItem}>
                                <Icon path={Icons.Mail} />
                                <Link src={`mailto:${user.email}`} style={styles.link}>{user.email}</Link>
                            </View>
                        )}
                        {user?.linkedin && (
                            <View style={styles.contactItem}>
                                <Icon path={Icons.Linkedin} />
                                <Link src={user.linkedin} style={styles.link}>LinkedIn</Link>
                            </View>
                        )}
                        {user?.github && (
                            <View style={styles.contactItem}>
                                <Icon path={Icons.Github} />
                                <Link src={user.github} style={styles.link}>GitHub</Link>
                            </View>
                        )}
                    </View>
                </View>

                {/* Professional Summary (Bio) */}
                {user?.bio && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.paragraph}>{user.bio}</Text>
                    </View>
                )}

                {/* Technical Skills */}
                {skills && skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Technical Skills</Text>
                        <View style={styles.skillRow}>
                            <Text style={styles.skillLabel}>Languages / Tools:</Text>
                            <Text style={styles.skillValue}>
                                {skills.map(s => s.name).join(', ')}
                            </Text>
                        </View>
                        {/* If we had categories we would list them. For now, flat list. */}
                    </View>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((project, index) => (
                            <View key={index} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>
                                        {project.title}
                                        {project.technologies && <Text style={styles.itemSubtitle}> — {formatTech(project.technologies)}</Text>}
                                    </Text>
                                    {project.link && <Link src={project.link} style={[styles.link, { fontSize: 9 }]}>View Project</Link>}
                                </View>
                                <View style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletText}>{project.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Internships / Experience */}
                {internships && internships.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {internships.map((int, index) => (
                            <View key={index} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{int.company}</Text>
                                    <Text style={styles.itemDate}>
                                        {new Date(int.startDate).getFullYear()} - {int.current ? 'Present' : new Date(int.endDate).getFullYear()}
                                    </Text>
                                </View>
                                <Text style={[styles.itemSubtitle, { marginBottom: 2 }]}>{int.role}</Text>
                                <View style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletText}>{int.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {/* Primary (College) */}
                    <View style={styles.item}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>Karpagam College of Engineering</Text>
                            <Text style={styles.itemDate}>{user?.year ? `Year ${user.year}` : '2023 - Present'}</Text>
                        </View>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemSubtitle}>{user?.branch ? `B.E. ${user.branch}` : 'Bachelor of Engineering'}</Text>
                            <Text style={styles.itemSubtitle}>{user?.cgpa ? `CGPA: ${user.cgpa}` : ''}</Text>
                        </View>
                    </View>
                    {/* Secondary (School) - Mocked structure to match visual if user doesn't have data, 
                        But we should probably only show what we have. 
                        I'll leave it as just the primary one for now to be safe. 
                    */}
                </View>

                {/* Certifications */}
                {certificates && certificates.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certificates.map((cert, index) => (
                            <View key={index} style={[styles.item, { marginBottom: 2 }]}>
                                <Text>
                                    <Text style={styles.itemTitle}>{cert.name}</Text>
                                    <Text> — {cert.issuer} ({new Date(cert.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })})</Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
};

export default ProfessionalTemplate;
