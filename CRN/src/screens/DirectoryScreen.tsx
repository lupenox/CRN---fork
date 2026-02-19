import React, { useState } from 'react';
import { Layout, Text, Card, Divider } from '@ui-kitten/components';
import { ScrollView, Linking } from 'react-native';

type Event = {
  id: number;
  title: string;
  location: string;
  hours: string;
  link: string;
  info: string;
};

const mockDirectoryElements: Event[] = [
  {
    id: 1,
    title: "Tutoring Center",
    location: "Bolton Hall 120",
    hours:"7:00 am - 7:00 pm",
    link: "https://uwm.edu/studentsuccess/tutoring-and-supplemental-instruction/",
    info:"Tutoring and Supplemental Instruction services within the Student Success Center is here to provide UW-Milwaukee undergraduate students with a variety of academic support services to empower them to learn, achieve, and succeed in college."
  },
  {
    id: 2,
    title: "Financial Aid Center",
    location: "Mellencamp Hall 162",
    hours:"7:00 am - 7:00 pm",
    link: "https://uwm.edu/finances/",
    info: "Student Financial Services represents the Offices of Financial Aid Administration, Student Accounts, and Student Scholarships. The Student Financial Service Center serves as students’ and families’ go-to place for answers to questions about scholarships, financial aid, and billing."
  },
];

export default function DirectoryScreen() {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {mockDirectoryElements.map(event => {
          const isExpanded = expandedIds.includes(event.id);
          return (
            <Card
              key={event.id}
              style={{ width: '100%', paddingVertical: 12 }}
              onPress={() => toggleExpand(event.id)}
            >
              <Text category="s1" style={{ marginBottom: 4 }}>{event.title}</Text>
              <Text appearance="hint" style={{ marginBottom: 8 }}>{event.location}</Text>

              {isExpanded && (
                <>
                  <Divider style={{ marginVertical: 8 }} />

                  <Text category="c1" style={{ marginBottom: 6 }}>Hours: {event.hours}</Text>
                  <Text style={{ marginBottom: 8 }}>{event.info}</Text>

                  <Text
                    style={{ color: '#3366FF', textDecorationLine: 'underline' }}
                    onPress={() => Linking.openURL(event.link)}
                  >
                    {event.link}
                  </Text>
                </>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </Layout>
  );
}
