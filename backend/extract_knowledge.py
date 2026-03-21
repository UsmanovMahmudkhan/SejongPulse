import pandas as pd
import os
import csv

excel_path = "/Users/mahmudkhonusmonov/Downloads/stitch/backend/knowledge/2026 Spring Lectuire Schedule(English)_20260123 (1).xlsx"
courses_csv = "/Users/mahmudkhonusmonov/Downloads/stitch/backend/knowledge/courses.csv"
professors_csv = "/Users/mahmudkhonusmonov/Downloads/stitch/backend/knowledge/professors.csv"

def extract():
    print("Reading Excel file...")
    df = pd.read_excel(excel_path)
    
    # Fill NaN with empty strings for easier processing
    df = df.fillna("")
    
    course_list = []
    professor_map = {} # name -> {department, office}
    
    for _, row in df.iterrows():
        # Mapping for courses.csv
        course_code = str(row['Course No.']).strip()
        course_name = str(row['Course Title']).strip()
        professor = str(row['Lecturer']).strip()
        semester = "2026-1"
        
        classification = str(row['Classification']).strip()
        credit = str(row['Credit']).strip()
        class_hour = str(row['Class Hour']).strip()
        venue = str(row['Venue']).strip()
        
        syllabus_summary = f"Classification: {classification}. Credits: {credit}. Hours: {class_hour}. Venue: {venue}."
        
        course_list.append({
            'course_code': course_code,
            'course_name': course_name,
            'professor': professor,
            'semester': semester,
            'syllabus_summary': syllabus_summary
        })
        
        # Mapping for professors.csv
        if professor and professor not in professor_map:
            department = str(row['Department/Major']).strip() or str(row['Department of Opening']).strip()
            professor_map[professor] = {
                'name': professor,
                'department': department,
                'office': venue, # Using first mentioned venue as potential office
                'email': "",
                'research_interests': ""
            }

    # Write courses.csv
    print(f"Writing {len(course_list)} courses to {courses_csv}...")
    with open(courses_csv, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['course_code', 'course_name', 'professor', 'semester', 'syllabus_summary'])
        writer.writeheader()
        writer.writerows(course_list)
        
    # Write professors.csv
    professor_list = list(professor_map.values())
    print(f"Writing {len(professor_list)} professors to {professors_csv}...")
    with open(professors_csv, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'department', 'office', 'email', 'research_interests'])
        writer.writeheader()
        writer.writerows(professor_list)

if __name__ == "__main__":
    if not os.path.exists(excel_path):
        print(f"Excel file not found at {excel_path}")
    else:
        extract()
        print("Done!")
