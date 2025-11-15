export interface Course {
  id: string
  code: string
  title: string
  credits: number
  department: string
  description: string
  prerequisites?: string[]
  fulfills: string[]
}

export const HAVERFORD_COURSES: Course[] = [
  // Computer Science
  { id: "cs101", code: "CMSC 105", title: "Introduction to Computer Science", credits: 1, department: "Computer Science", description: "Fundamental concepts of computer science and programming.", fulfills: ["QR"], prerequisites: [] },
  { id: "cs106", code: "CMSC 106", title: "Introduction to Computer Science", credits: 1, department: "Computer Science", description: "Programming fundamentals and problem solving.", fulfills: ["QR"], prerequisites: [] },
  { id: "cs231", code: "CMSC 231", title: "Data Structures and Algorithms", credits: 1, department: "Computer Science", description: "Core data structures and algorithmic techniques.", fulfills: ["QR"], prerequisites: ["CMSC 106"] },
  { id: "cs245", code: "CMSC 245", title: "Principles of Programming Languages", credits: 1, department: "Computer Science", description: "Study of programming language design and implementation.", fulfills: ["QR"], prerequisites: ["CMSC 231"] },
  { id: "cs249", code: "CMSC 249", title: "Computer Systems", credits: 1, department: "Computer Science", description: "Computer architecture and systems programming.", fulfills: ["QR"], prerequisites: ["CMSC 231"] },
  { id: "cs360", code: "CMSC 360", title: "Machine Learning", credits: 1, department: "Computer Science", description: "Introduction to machine learning algorithms and applications.", fulfills: ["QR"], prerequisites: ["CMSC 231", "MATH 215"] },

  // Mathematics
  { id: "math113", code: "MATH 113", title: "Calculus I", credits: 1, department: "Mathematics", description: "Differential calculus of functions of one variable.", fulfills: ["QR"], prerequisites: [] },
  { id: "math114", code: "MATH 114", title: "Calculus II", credits: 1, department: "Mathematics", description: "Integral calculus and infinite series.", fulfills: ["QR"], prerequisites: ["MATH 113"] },
  { id: "math215", code: "MATH 215", title: "Multivariable Calculus", credits: 1, department: "Mathematics", description: "Calculus of functions of several variables.", fulfills: ["QR"], prerequisites: ["MATH 114"] },
  { id: "math216", code: "MATH 216", title: "Linear Algebra", credits: 1, department: "Mathematics", description: "Vector spaces, linear transformations, and matrices.", fulfills: ["QR"], prerequisites: ["MATH 114"] },
  { id: "math317", code: "MATH 317", title: "Abstract Algebra", credits: 1, department: "Mathematics", description: "Groups, rings, and fields.", fulfills: ["QR"], prerequisites: ["MATH 216"] },
  { id: "math333", code: "MATH 333", title: "Differential Equations", credits: 1, department: "Mathematics", description: "Ordinary and partial differential equations.", fulfills: ["QR"], prerequisites: ["MATH 215"] },

  // Physics
  { id: "phys105", code: "PHYS 105", title: "Introductory Physics I", credits: 1, department: "Physics", description: "Mechanics and thermodynamics.", fulfills: ["NS"], prerequisites: [] },
  { id: "phys106", code: "PHYS 106", title: "Introductory Physics II", credits: 1, department: "Physics", description: "Electricity, magnetism, and optics.", fulfills: ["NS"], prerequisites: ["PHYS 105"] },
  { id: "phys213", code: "PHYS 213", title: "Modern Physics", credits: 1, department: "Physics", description: "Quantum mechanics and relativity.", fulfills: ["NS"], prerequisites: ["PHYS 106"] },
  { id: "phys214", code: "PHYS 214", title: "Quantum Mechanics", credits: 1, department: "Physics", description: "Introduction to quantum theory.", fulfills: ["NS"], prerequisites: ["PHYS 213"] },

  // Chemistry
  { id: "chem103", code: "CHEM 103", title: "General Chemistry I", credits: 1, department: "Chemistry", description: "Fundamental principles of chemistry.", fulfills: ["NS"], prerequisites: [] },
  { id: "chem104", code: "CHEM 104", title: "General Chemistry II", credits: 1, department: "Chemistry", description: "Chemical equilibrium and kinetics.", fulfills: ["NS"], prerequisites: ["CHEM 103"] },
  { id: "chem221", code: "CHEM 221", title: "Organic Chemistry I", credits: 1, department: "Chemistry", description: "Structure and reactions of organic compounds.", fulfills: ["NS"], prerequisites: ["CHEM 104"] },
  { id: "chem222", code: "CHEM 222", title: "Organic Chemistry II", credits: 1, department: "Chemistry", description: "Advanced organic chemistry reactions.", fulfills: ["NS"], prerequisites: ["CHEM 221"] },

  // Biology
  { id: "biol200", code: "BIOL 200", title: "Foundations of Biology", credits: 1, department: "Biology", description: "Introduction to biological principles.", fulfills: ["NS"], prerequisites: [] },
  { id: "biol201", code: "BIOL 201", title: "Cell and Molecular Biology", credits: 1, department: "Biology", description: "Structure and function of cells.", fulfills: ["NS"], prerequisites: ["BIOL 200"] },
  { id: "biol202", code: "BIOL 202", title: "Genetics", credits: 1, department: "Biology", description: "Principles of heredity and gene expression.", fulfills: ["NS"], prerequisites: ["BIOL 201"] },
  { id: "biol301", code: "BIOL 301", title: "Ecology", credits: 1, department: "Biology", description: "Interactions between organisms and environment.", fulfills: ["NS"], prerequisites: ["BIOL 200"] },

  // Economics
  { id: "econ101", code: "ECON 101", title: "Introductory Microeconomics", credits: 1, department: "Economics", description: "Individual and firm decision making.", fulfills: ["SS"], prerequisites: [] },
  { id: "econ102", code: "ECON 102", title: "Introductory Macroeconomics", credits: 1, department: "Economics", description: "National economic systems and policy.", fulfills: ["SS"], prerequisites: [] },
  { id: "econ203", code: "ECON 203", title: "Statistics for Economics", credits: 1, department: "Economics", description: "Statistical methods in economic analysis.", fulfills: ["QR"], prerequisites: ["ECON 101", "ECON 102"] },
  { id: "econ302", code: "ECON 302", title: "Intermediate Microeconomics", credits: 1, department: "Economics", description: "Advanced microeconomic theory.", fulfills: ["SS"], prerequisites: ["ECON 101", "MATH 114"] },

  // English
  { id: "engl101", code: "ENGL 101", title: "First-Year Writing", credits: 1, department: "English", description: "Academic writing and critical thinking.", fulfills: ["WR"], prerequisites: [] },
  { id: "engl205", code: "ENGL 205", title: "Introduction to Literary Studies", credits: 1, department: "English", description: "Methods of literary analysis.", fulfills: ["HU"], prerequisites: [] },
  { id: "engl280", code: "ENGL 280", title: "Shakespeare", credits: 1, department: "English", description: "Study of Shakespeare's major works.", fulfills: ["HU"], prerequisites: [] },
  { id: "engl350", code: "ENGL 350", title: "Modern American Literature", credits: 1, department: "English", description: "20th century American literary works.", fulfills: ["HU"], prerequisites: ["ENGL 205"] },

  // History
  { id: "hist101", code: "HIST 101", title: "Introduction to Historical Methods", credits: 1, department: "History", description: "Research methods and historical thinking.", fulfills: ["SS"], prerequisites: [] },
  { id: "hist205", code: "HIST 205", title: "Modern European History", credits: 1, department: "History", description: "Europe from 1789 to present.", fulfills: ["SS"], prerequisites: [] },
  { id: "hist210", code: "HIST 210", title: "American History to 1865", credits: 1, department: "History", description: "Colonial period through Civil War.", fulfills: ["SS"], prerequisites: [] },
  { id: "hist211", code: "HIST 211", title: "American History since 1865", credits: 1, department: "History", description: "Reconstruction to present day.", fulfills: ["SS"], prerequisites: [] },

  // Philosophy
  { id: "phil101", code: "PHIL 101", title: "Introduction to Philosophy", credits: 1, department: "Philosophy", description: "Fundamental philosophical questions.", fulfills: ["HU"], prerequisites: [] },
  { id: "phil204", code: "PHIL 204", title: "Logic", credits: 1, department: "Philosophy", description: "Formal and informal logic.", fulfills: ["QR"], prerequisites: [] },
  { id: "phil205", code: "PHIL 205", title: "Ethics", credits: 1, department: "Philosophy", description: "Moral philosophy and ethical theory.", fulfills: ["HU"], prerequisites: [] },
  { id: "phil301", code: "PHIL 301", title: "Ancient Philosophy", credits: 1, department: "Philosophy", description: "Greek and Roman philosophical thought.", fulfills: ["HU"], prerequisites: ["PHIL 101"] },

  // Psychology
  { id: "psyc101", code: "PSYC 101", title: "Introduction to Psychology", credits: 1, department: "Psychology", description: "Overview of psychological science.", fulfills: ["SS"], prerequisites: [] },
  { id: "psyc200", code: "PSYC 200", title: "Statistics for Psychology", credits: 1, department: "Psychology", description: "Statistical methods in psychology.", fulfills: ["QR"], prerequisites: ["PSYC 101"] },
  { id: "psyc205", code: "PSYC 205", title: "Research Methods", credits: 1, department: "Psychology", description: "Experimental design and methodology.", fulfills: ["SS"], prerequisites: ["PSYC 200"] },
  { id: "psyc240", code: "PSYC 240", title: "Cognitive Psychology", credits: 1, department: "Psychology", description: "Mental processes and cognition.", fulfills: ["SS"], prerequisites: ["PSYC 101"] },

  // Political Science
  { id: "pols101", code: "POLS 101", title: "Introduction to Political Science", credits: 1, department: "Political Science", description: "Fundamental concepts in political science.", fulfills: ["SS"], prerequisites: [] },
  { id: "pols120", code: "POLS 120", title: "American Government", credits: 1, department: "Political Science", description: "Structure and function of US government.", fulfills: ["SS"], prerequisites: [] },
  { id: "pols150", code: "POLS 150", title: "International Relations", credits: 1, department: "Political Science", description: "Global politics and international systems.", fulfills: ["SS"], prerequisites: [] },
  { id: "pols240", code: "POLS 240", title: "Comparative Politics", credits: 1, department: "Political Science", description: "Comparative analysis of political systems.", fulfills: ["SS"], prerequisites: ["POLS 101"] },

  // Sociology
  { id: "soci101", code: "SOCI 101", title: "Introduction to Sociology", credits: 1, department: "Sociology", description: "Basic concepts and theories in sociology.", fulfills: ["SS"], prerequisites: [] },
  { id: "soci205", code: "SOCI 205", title: "Social Research Methods", credits: 1, department: "Sociology", description: "Quantitative and qualitative research methods.", fulfills: ["SS"], prerequisites: ["SOCI 101"] },
  { id: "soci240", code: "SOCI 240", title: "Social Inequality", credits: 1, department: "Sociology", description: "Class, race, and gender stratification.", fulfills: ["SS"], prerequisites: ["SOCI 101"] },
  { id: "soci301", code: "SOCI 301", title: "Classical Sociological Theory", credits: 1, department: "Sociology", description: "Foundational sociological theorists.", fulfills: ["SS"], prerequisites: ["SOCI 101"] },

  // Art and Art History
  { id: "arth101", code: "ARTH 101", title: "Introduction to Art History", credits: 1, department: "Art and Art History", description: "Survey of Western art history.", fulfills: ["HU"], prerequisites: [] },
  { id: "arts110", code: "ARTS 110", title: "Drawing I", credits: 1, department: "Art and Art History", description: "Fundamental drawing techniques.", fulfills: ["HU"], prerequisites: [] },
  { id: "arts120", code: "ARTS 120", title: "Painting I", credits: 1, department: "Art and Art History", description: "Introduction to painting methods.", fulfills: ["HU"], prerequisites: [] },
  { id: "arth205", code: "ARTH 205", title: "Modern Art", credits: 1, department: "Art and Art History", description: "Art from 1850 to 1945.", fulfills: ["HU"], prerequisites: ["ARTH 101"] },

  // Music
  { id: "musc101", code: "MUSC 101", title: "Introduction to Music", credits: 1, department: "Music", description: "Elements of music and listening skills.", fulfills: ["HU"], prerequisites: [] },
  { id: "musc111", code: "MUSC 111", title: "Music Theory I", credits: 1, department: "Music", description: "Fundamentals of tonal harmony.", fulfills: ["HU"], prerequisites: [] },
  { id: "musc112", code: "MUSC 112", title: "Music Theory II", credits: 1, department: "Music", description: "Advanced harmonic analysis.", fulfills: ["HU"], prerequisites: ["MUSC 111"] },
  { id: "musc205", code: "MUSC 205", title: "Music History", credits: 1, department: "Music", description: "Western classical music tradition.", fulfills: ["HU"], prerequisites: ["MUSC 101"] },

  // Anthropology
  { id: "anth103", code: "ANTH 103", title: "Introduction to Cultural Anthropology", credits: 1, department: "Anthropology", description: "Human cultures and societies.", fulfills: ["SS"], prerequisites: [] },
  { id: "anth104", code: "ANTH 104", title: "Introduction to Archaeology", credits: 1, department: "Anthropology", description: "Methods and theories in archaeology.", fulfills: ["SS"], prerequisites: [] },
  { id: "anth240", code: "ANTH 240", title: "Medical Anthropology", credits: 1, department: "Anthropology", description: "Culture and health practices.", fulfills: ["SS"], prerequisites: ["ANTH 103"] },

  // Religion
  { id: "relg101", code: "RELG 101", title: "Introduction to Religious Studies", credits: 1, department: "Religion", description: "Comparative study of world religions.", fulfills: ["HU"], prerequisites: [] },
  { id: "relg205", code: "RELG 205", title: "Biblical Studies", credits: 1, department: "Religion", description: "Critical study of biblical texts.", fulfills: ["HU"], prerequisites: [] },
  { id: "relg240", code: "RELG 240", title: "Ethics and Religion", credits: 1, department: "Religion", description: "Religious approaches to moral questions.", fulfills: ["HU"], prerequisites: ["RELG 101"] },

  // Classics
  { id: "clas101", code: "CLAS 101", title: "Introduction to Classical Civilization", credits: 1, department: "Classics", description: "Ancient Greek and Roman culture.", fulfills: ["HU"], prerequisites: [] },
  { id: "grek101", code: "GREK 101", title: "Elementary Greek", credits: 1, department: "Classics", description: "Introduction to ancient Greek language.", fulfills: ["HU"], prerequisites: [] },
  { id: "latn101", code: "LATN 101", title: "Elementary Latin", credits: 1, department: "Classics", description: "Introduction to Latin language.", fulfills: ["HU"], prerequisites: [] },

  // French
  { id: "fren101", code: "FREN 101", title: "Elementary French", credits: 1, department: "French and Francophone Studies", description: "Introduction to French language.", fulfills: ["HU"], prerequisites: [] },
  { id: "fren102", code: "FREN 102", title: "Elementary French II", credits: 1, department: "French and Francophone Studies", description: "Continued French language study.", fulfills: ["HU"], prerequisites: ["FREN 101"] },
  { id: "fren201", code: "FREN 201", title: "Intermediate French", credits: 1, department: "French and Francophone Studies", description: "Intermediate French language skills.", fulfills: ["HU"], prerequisites: ["FREN 102"] },

  // Spanish
  { id: "span101", code: "SPAN 101", title: "Elementary Spanish", credits: 1, department: "Spanish", description: "Introduction to Spanish language.", fulfills: ["HU"], prerequisites: [] },
  { id: "span102", code: "SPAN 102", title: "Elementary Spanish II", credits: 1, department: "Spanish", description: "Continued Spanish language study.", fulfills: ["HU"], prerequisites: ["SPAN 101"] },
  { id: "span201", code: "SPAN 201", title: "Intermediate Spanish", credits: 1, department: "Spanish", description: "Intermediate Spanish language skills.", fulfills: ["HU"], prerequisites: ["SPAN 102"] },

  // Astronomy
  { id: "astr104", code: "ASTR 104", title: "Introduction to Astronomy", credits: 1, department: "Astronomy", description: "Survey of the universe and celestial objects.", fulfills: ["NS"], prerequisites: [] },
  { id: "astr205", code: "ASTR 205", title: "Stellar Astronomy", credits: 1, department: "Astronomy", description: "Physics and evolution of stars.", fulfills: ["NS"], prerequisites: ["ASTR 104", "PHYS 106"] },
]

export const COURSE_DEPARTMENTS = [
  "Anthropology", "Art and Art History", "Astronomy", "Biology", "Chemistry", 
  "Classics", "Computer Science", "Economics", "English", "French and Francophone Studies",
  "History", "Mathematics", "Music", "Philosophy", "Physics", "Political Science",
  "Psychology", "Religion", "Sociology", "Spanish"
]

export const FULFILLMENT_AREAS = {
  "HU": "Humanities",
  "SS": "Social Sciences", 
  "NS": "Natural Sciences",
  "QR": "Quantitative Reasoning",
  "WR": "Writing"
}