export interface Course {
  course_code:   string;
  title:         string;
  crn:           string;
  section:       string;
  schedule_type: string;
  meets:         string;
  meeting_times: { day: string; start_time: string; end_time: string }[];
  instructor:    string;
  start_date?:   string;
  end_date?:     string;
}

export async function searchCourses(query: string, subject: string): Promise<Course[]> {
  try {
    const response = await fetch('https://crn.crn.deno.net/dynamic?table=course');
    const json = await response.json();
    const data: Course[] = json.data ?? [];

    return data.filter((c) => {
      const matchesQuery = !query ||
        c.title?.toLowerCase().includes(query.toLowerCase()) ||
        c.course_code?.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(query.toLowerCase()) ||
        c.crn?.includes(query);

      const matchesSubject = !subject ||
        c.course_code?.toUpperCase().startsWith(subject.toUpperCase());

      return matchesQuery && matchesSubject;
    });
  } catch (error) {
    console.log('Error fetching courses:', error);
    return [];
  }
}
