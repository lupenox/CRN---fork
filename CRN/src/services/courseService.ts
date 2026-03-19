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
    const data: Course[] = require('../../scripts/uwm_courses.json');

    return data.filter((c) => {
      const matchesQuery = !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.course_code.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase()) ||
        c.crn.includes(query);

      const matchesSubject = !subject ||
        c.course_code.toUpperCase().startsWith(subject.toUpperCase());

      return matchesQuery && matchesSubject;
    });

}
