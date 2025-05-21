import {
  users,
  jobs,
  savedJobs,
  jobSources,
  notifications,
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type SavedJob,
  type InsertSavedJob,
  type JobSource,
  type InsertJobSource,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like, or, isNull } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // Job methods
  getJobs(filters: any, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }>;
  getJob(id: number): Promise<Job | undefined>;
  
  // Saved Jobs methods
  saveJob(userId: number, jobId: number): Promise<SavedJob>;
  unsaveJob(userId: number, jobId: number): Promise<void>;
  getSavedJobsByUserId(userId: number): Promise<SavedJob[]>;
  isJobSavedByUser(userId: number, jobId: number): Promise<boolean>;
  getSavedJobs(userId: number, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }>;
  
  // Job Sources methods
  getJobSources(page: number, limit: number): Promise<{ data: JobSource[], total: number, page: number, limit: number, totalPages: number }>;
  createJobSource(source: InsertJobSource): Promise<JobSource>;
  
  // Notification methods
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: number): Promise<number>;
  getNotification(id: number): Promise<Notification | undefined>;
  markNotificationAsRead(id: number): Promise<void>;
  createNotification(notification: InsertNotification): Promise<Notification>;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Innovative Tech Solutions",
    description: "We are looking for a Senior Frontend Developer with 5+ years of experience in React.js to join our dynamic team.",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    jobType: "Full Time",
    salary: "$80K - $100K",
    remote: true,
    url: "https://example.com/jobs/1",
    source: "LinkedIn",
    sourceId: "linkedin-123",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    category: "Engineering",
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    company: "Global Brands Inc.",
    description: "We're seeking an experienced Product Marketing Manager to lead our go-to-market strategy for new product launches.",
    location: "Cairo, Egypt",
    country: "Egypt",
    jobType: "Full Time",
    salary: "$50K - $75K",
    remote: false,
    url: "https://example.com/jobs/2",
    source: "Bayt.com",
    sourceId: "bayt-456",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    category: "Marketing",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Creative Design Studio",
    description: "Join our award-winning design team to create beautiful and intuitive user experiences for our clients across various industries.",
    location: "Riyadh, Saudi Arabia",
    country: "Saudi Arabia",
    jobType: "Full Time",
    salary: "$60K - $85K",
    remote: false,
    url: "https://example.com/jobs/3",
    source: "Wuzzuf",
    sourceId: "wuzzuf-789",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    category: "Design",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Data Insights Co.",
    description: "We're looking for a Data Analyst with strong SQL and visualization skills to help drive business decisions through data insights.",
    location: "Amman, Jordan",
    country: "Jordan",
    jobType: "Full Time",
    salary: "$45K - $65K",
    remote: true,
    url: "https://example.com/jobs/4",
    source: "GulfTalent",
    sourceId: "gulftalent-101112",
    createdAt: new Date(), // Today
    category: "Engineering",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Tech Innovations",
    description: "Looking for a skilled backend developer with experience in Node.js and database design.",
    location: "Abu Dhabi, UAE",
    country: "United Arab Emirates",
    jobType: "Contract",
    salary: "$70K - $90K",
    remote: true,
    url: "https://example.com/jobs/5",
    source: "LinkedIn",
    sourceId: "linkedin-131415",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    category: "Engineering",
  },
  {
    id: 6,
    title: "Sales Manager",
    company: "Al-Futtaim Group",
    description: "We're looking for a Sales Manager with proven experience in retail sales to join our expanding team in the automotive division.",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    jobType: "Full Time",
    salary: "$65K - $85K",
    remote: false,
    url: "https://example.com/jobs/6",
    source: "LinkedIn",
    sourceId: "linkedin-161718",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    category: "Sales",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Cloud Solutions ME",
    description: "Seeking a skilled DevOps Engineer to help us build and maintain our cloud infrastructure and CI/CD pipelines.",
    location: "Doha, Qatar",
    country: "Qatar",
    jobType: "Full Time",
    salary: "$75K - $95K",
    remote: true,
    url: "https://example.com/jobs/7",
    source: "GulfTalent",
    sourceId: "gulftalent-192021",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    category: "Engineering",
  },
  {
    id: 8,
    title: "Finance Director",
    company: "MENA Investments",
    description: "Experienced Finance Director needed to oversee financial operations and strategy for a leading investment firm.",
    location: "Riyadh, Saudi Arabia",
    country: "Saudi Arabia",
    jobType: "Full Time",
    salary: "$120K - $150K",
    remote: false,
    url: "https://example.com/jobs/8",
    source: "Bayt.com",
    sourceId: "bayt-222324",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    category: "Finance",
  },
  {
    id: 9,
    title: "HR Specialist",
    company: "Talent Hub Arabia",
    description: "Join our team as an HR Specialist to help manage recruitment, employee relations, and HR processes for our clients across the Middle East.",
    location: "Cairo, Egypt",
    country: "Egypt",
    jobType: "Part Time",
    salary: "$30K - $45K",
    remote: true,
    url: "https://example.com/jobs/9",
    source: "Wuzzuf",
    sourceId: "wuzzuf-252627",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    category: "Human Resources",
  },
  {
    id: 10,
    title: "Content Creator",
    company: "Digital Marketing Solutions",
    description: "Creative Content Creator needed to develop engaging Arabic and English content for social media, blogs, and marketing campaigns.",
    location: "Beirut, Lebanon",
    country: "Lebanon",
    jobType: "Freelance",
    salary: "$20K - $40K",
    remote: true,
    url: "https://example.com/jobs/10",
    source: "LinkedIn",
    sourceId: "linkedin-282930",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    category: "Marketing",
  },
  {
    id: 11,
    title: "E-commerce Manager",
    company: "Online Retail Group",
    description: "E-commerce Manager needed to oversee online retail operations, implement growth strategies, and optimize the customer journey.",
    location: "Amman, Jordan",
    country: "Jordan",
    jobType: "Full Time",
    salary: "$55K - $70K",
    remote: false,
    url: "https://example.com/jobs/11",
    source: "GulfTalent",
    sourceId: "gulftalent-313233",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
    category: "Sales",
  },
  {
    id: 12,
    title: "Mobile App Developer",
    company: "Tech Startups Inc.",
    description: "Seeking a talented Mobile App Developer with experience in React Native or Flutter to build innovative mobile applications.",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    jobType: "Contract",
    salary: "$60K - $80K",
    remote: true,
    url: "https://example.com/jobs/12",
    source: "LinkedIn",
    sourceId: "linkedin-343536",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    category: "Engineering",
  },
  {
    id: 13,
    title: "Legal Advisor",
    company: "MENA Legal Consultants",
    description: "Experienced Legal Advisor with knowledge of GCC business laws needed to provide legal counsel to our corporate clients.",
    location: "Kuwait City, Kuwait",
    country: "Kuwait",
    jobType: "Full Time",
    salary: "$70K - $90K",
    remote: false,
    url: "https://example.com/jobs/13",
    source: "Bayt.com",
    sourceId: "bayt-373839",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    category: "Legal",
  },
  {
    id: 14,
    title: "Project Manager",
    company: "Construction Solutions ME",
    description: "Project Manager with construction experience needed to oversee large-scale development projects across the Middle East.",
    location: "Doha, Qatar",
    country: "Qatar",
    jobType: "Full Time",
    salary: "$85K - $110K",
    remote: false,
    url: "https://example.com/jobs/14",
    source: "GulfTalent",
    sourceId: "gulftalent-404142",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    category: "Project Management",
  },
  {
    id: 15,
    title: "Arabic Translator",
    company: "Language Solutions Arabia",
    description: "Professional Arabic-English translator needed for legal, business, and technical document translation services.",
    location: "Cairo, Egypt",
    country: "Egypt",
    jobType: "Freelance",
    salary: "$25K - $40K",
    remote: true,
    url: "https://example.com/jobs/15",
    source: "Wuzzuf",
    sourceId: "wuzzuf-434445",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    category: "Language & Translation",
  }
];

const mockJobSources: JobSource[] = [
  {
    id: 1,
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs",
    category: "Job Board",
    description: "The world's largest professional network with job listings across all industries.",
    submitterEmail: null,
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  },
  {
    id: 2,
    name: "Bayt.com",
    url: "https://www.bayt.com",
    category: "Job Board",
    description: "The leading job site in the Middle East and North Africa, connecting job seekers with employers.",
    submitterEmail: null,
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28), // 28 days ago
  },
  {
    id: 3,
    name: "Wuzzuf",
    url: "https://wuzzuf.net",
    category: "Job Board",
    description: "Egypt's leading online recruitment platform connecting the best talent with top companies in the country.",
    submitterEmail: null,
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
  },
  {
    id: 4,
    name: "GulfTalent",
    url: "https://www.gulftalent.com",
    category: "Job Board",
    description: "Leading job site for professionals in the Middle East and Gulf region.",
    submitterEmail: null,
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
  },
];

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private jobsData: Map<number, Job>;
  private savedJobsData: Map<number, SavedJob>;
  private jobSourcesData: Map<number, JobSource>;
  private notificationsData: Map<number, Notification>;
  
  private nextUserId: number;
  private nextJobId: number;
  private nextSavedJobId: number;
  private nextJobSourceId: number;
  private nextNotificationId: number;

  constructor() {
    this.usersData = new Map();
    this.jobsData = new Map();
    this.savedJobsData = new Map();
    this.jobSourcesData = new Map();
    this.notificationsData = new Map();
    
    this.nextUserId = 1;
    this.nextJobId = 1;
    this.nextSavedJobId = 1;
    this.nextJobSourceId = 1;
    this.nextNotificationId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock jobs
    mockJobs.forEach(job => {
      this.jobsData.set(job.id, job);
      this.nextJobId = Math.max(this.nextJobId, job.id + 1);
    });

    // Add mock job sources
    mockJobSources.forEach(source => {
      this.jobSourcesData.set(source.id, source);
      this.nextJobSourceId = Math.max(this.nextJobSourceId, source.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { 
      ...userData, 
      id,
      avatar: null,
      preferredLanguage: userData.preferredLanguage || "en",
    };
    this.usersData.set(id, user);

    // Create welcome notification
    this.createNotification({
      userId: id,
      title: "Welcome to JobHub!",
      message: "Thank you for joining JobHub. Start exploring job opportunities now."
    });

    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = { ...user, ...data };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Job methods
  async getJobs(filters: any, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }> {
    let filteredJobs = Array.from(this.jobsData.values());
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) || 
          job.company.toLowerCase().includes(searchLower) || 
          job.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.category) {
        filteredJobs = filteredJobs.filter(job => 
          job.category === filters.category
        );
      }
      
      if (filters.jobType) {
        filteredJobs = filteredJobs.filter(job => 
          job.jobType === filters.jobType
        );
      }
      
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.includes(filters.location) || 
          job.country === filters.location
        );
      }
      
      if (filters.remote) {
        filteredJobs = filteredJobs.filter(job => 
          job.remote === true
        );
      }
      
      if (filters.salary) {
        filteredJobs = filteredJobs.filter(job => 
          job.salary === filters.salary
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'recent':
            filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'salary':
            // This is a simplistic sorting by salary - in a real implementation, you'd parse the salary ranges
            filteredJobs.sort((a, b) => {
              const aValue = a.salary ? a.salary.replace(/[^0-9]/g, '') : '0';
              const bValue = b.salary ? b.salary.replace(/[^0-9]/g, '') : '0';
              return parseInt(bValue) - parseInt(aValue);
            });
            break;
          case 'relevance':
            // In a real implementation, this would use more sophisticated relevance scoring
            break;
        }
      }
    }
    
    // Apply pagination
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    
    return {
      data: paginatedJobs,
      total,
      page,
      limit,
      totalPages
    };
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobsData.get(id);
  }

  // Saved Jobs methods
  async saveJob(userId: number, jobId: number): Promise<SavedJob> {
    const id = this.nextSavedJobId++;
    const savedJob: SavedJob = {
      id,
      userId,
      jobId,
      createdAt: new Date()
    };
    this.savedJobsData.set(id, savedJob);
    return savedJob;
  }

  async unsaveJob(userId: number, jobId: number): Promise<void> {
    const savedJobEntry = Array.from(this.savedJobsData.entries()).find(
      ([_, savedJob]) => savedJob.userId === userId && savedJob.jobId === jobId
    );
    
    if (savedJobEntry) {
      this.savedJobsData.delete(savedJobEntry[0]);
    }
  }

  async getSavedJobsByUserId(userId: number): Promise<SavedJob[]> {
    return Array.from(this.savedJobsData.values()).filter(
      (savedJob) => savedJob.userId === userId
    );
  }

  async isJobSavedByUser(userId: number, jobId: number): Promise<boolean> {
    return Array.from(this.savedJobsData.values()).some(
      (savedJob) => savedJob.userId === userId && savedJob.jobId === jobId
    );
  }

  async getSavedJobs(userId: number, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }> {
    const savedJobs = await this.getSavedJobsByUserId(userId);
    const savedJobIds = savedJobs.map(sj => sj.jobId);
    
    // Get the job objects
    const jobs = Array.from(this.jobsData.values()).filter(
      job => savedJobIds.includes(job.id)
    );
    
    // Apply pagination
    const total = jobs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    
    return {
      data: paginatedJobs,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Job Sources methods
  async getJobSources(page: number, limit: number): Promise<{ data: JobSource[], total: number, page: number, limit: number, totalPages: number }> {
    const jobSources = Array.from(this.jobSourcesData.values()).filter(
      source => source.approved
    );
    
    // Apply pagination
    const total = jobSources.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSources = jobSources.slice(startIndex, endIndex);
    
    return {
      data: paginatedSources,
      total,
      page,
      limit,
      totalPages
    };
  }

  async createJobSource(sourceData: InsertJobSource): Promise<JobSource> {
    const id = this.nextJobSourceId++;
    const jobSource: JobSource = {
      ...sourceData,
      id,
      approved: false,
      createdAt: new Date()
    };
    this.jobSourcesData.set(id, jobSource);
    return jobSource;
  }

  // Notification methods
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsData.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return Array.from(this.notificationsData.values()).filter(
      notification => notification.userId === userId && !notification.read
    ).length;
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notificationsData.get(id);
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notificationsData.get(id);
    if (notification) {
      notification.read = true;
      this.notificationsData.set(id, notification);
    }
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = this.nextNotificationId++;
    const notification: Notification = {
      ...notificationData,
      id,
      read: false,
      createdAt: new Date()
    };
    this.notificationsData.set(id, notification);
    return notification;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        avatar: null,
        preferredLanguage: userData.preferredLanguage || "en",
      })
      .returning();
      
    // Create welcome notification
    this.createNotification({
      userId: user.id,
      title: "Welcome to JobHub!",
      message: "Thank you for joining JobHub. Start exploring job opportunities now."
    });
    
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Job methods
  async getJobs(filters: any, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select().from(jobs);
    const conditions = [];
    
    // Apply filters
    if (filters) {
      // Search filter - look in title, company, and description fields
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(
          or(
            like(sql`LOWER(${jobs.title})`, searchTerm),
            like(sql`LOWER(${jobs.company})`, searchTerm),
            like(sql`LOWER(${jobs.description})`, searchTerm)
          )
        );
      }
      
      // Category filter
      if (filters.category && filters.category !== 'all') {
        conditions.push(eq(jobs.category, filters.category));
      }
      
      // Job Type filter
      if (filters.jobType && filters.jobType !== 'all') {
        conditions.push(eq(jobs.jobType, filters.jobType));
      }
      
      // Location filter - search in both location field and country field
      if (filters.location && filters.location !== 'all') {
        conditions.push(
          or(
            like(jobs.location, `%${filters.location}%`),
            eq(jobs.country, filters.location)
          )
        );
      }
      
      // Remote filter - only show remote jobs if checked
      if (filters.remote === true) {
        conditions.push(eq(jobs.remote, true));
      }
      
      // Salary filter
      if (filters.salary && filters.salary !== 'all' && filters.salary !== 'Any Salary') {
        // Handle salary ranges in text format
        // This is a simplified approach for text-based salary fields
        if (filters.salary === 'Under $30k') {
          conditions.push(like(jobs.salary, '%$%K%'));
          conditions.push(
            or(
              like(jobs.salary, '%$1%K%'),
              like(jobs.salary, '%$2%K%')
            )
          );
        } else if (filters.salary === '$30k - $50k') {
          conditions.push(
            or(
              like(jobs.salary, '%$3%K%'),
              like(jobs.salary, '%$4%K%'),
              like(jobs.salary, '%$50K%')
            )
          );
        } else if (filters.salary === '$50k - $80k') {
          conditions.push(
            or(
              like(jobs.salary, '%$5%K%'),
              like(jobs.salary, '%$6%K%'),
              like(jobs.salary, '%$7%K%'),
              like(jobs.salary, '%$80K%')
            )
          );
        } else if (filters.salary === '$80k - $100k') {
          conditions.push(
            or(
              like(jobs.salary, '%$8%K%'),
              like(jobs.salary, '%$9%K%'),
              like(jobs.salary, '%$10%K%')
            )
          );
        } else if (filters.salary === '$100k+') {
          conditions.push(
            or(
              like(jobs.salary, '%$10%K%'),
              like(jobs.salary, '%$11%K%'),
              like(jobs.salary, '%$12%K%'),
              like(jobs.salary, '%$13%K%'),
              like(jobs.salary, '%$14%K%'),
              like(jobs.salary, '%$15%K%')
            )
          );
        }
      }
    }
    
    // Apply WHERE conditions
    if (conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition);
      }
    }
    
    // Count total records with applied filters
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(jobs);
      
    if (conditions.length > 0) {
      for (const condition of conditions) {
        countQuery.where(condition);
      }
    }
    
    const countResult = await countQuery.execute();
    const total = Number(countResult[0]?.count || 0);
    
    // Apply sorting
    if (!filters?.sortBy || filters?.sortBy === 'recent') {
      // Default sort is by recency
      query = query.orderBy(desc(jobs.createdAt));
    } else if (filters?.sortBy === 'salary') {
      // For text-based salary field, this is approximate
      query = query.orderBy(desc(jobs.salary));
    } else if (filters?.sortBy === 'relevance' && filters.search) {
      // Simple relevance sorting - title matches first, then company, then description
      // In a real app, you'd use a more sophisticated approach
      query = query.orderBy(
        desc(sql`CASE WHEN LOWER(${jobs.title}) LIKE ${'%' + filters.search.toLowerCase() + '%'} THEN 3
                     WHEN LOWER(${jobs.company}) LIKE ${'%' + filters.search.toLowerCase() + '%'} THEN 2
                     WHEN LOWER(${jobs.description}) LIKE ${'%' + filters.search.toLowerCase() + '%'} THEN 1
                     ELSE 0 END`)
      );
    }
    
    // Apply pagination
    const jobsList = await query.limit(limit).offset(offset).execute();
    
    console.log(`Applied filters: ${JSON.stringify(filters)}, Found: ${total} jobs`);
    
    return {
      data: jobsList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }
  
  // Saved Jobs methods
  async saveJob(userId: number, jobId: number): Promise<SavedJob> {
    const [savedJob] = await db
      .insert(savedJobs)
      .values({ 
        userId, 
        jobId, 
        createdAt: new Date() 
      })
      .returning();
    return savedJob;
  }

  async unsaveJob(userId: number, jobId: number): Promise<void> {
    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
  }

  async getSavedJobsByUserId(userId: number): Promise<SavedJob[]> {
    return await db
      .select()
      .from(savedJobs)
      .where(eq(savedJobs.userId, userId));
  }

  async isJobSavedByUser(userId: number, jobId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    return !!result;
  }

  async getSavedJobs(userId: number, page: number, limit: number): Promise<{ data: Job[], total: number, page: number, limit: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    
    // Join savedJobs and jobs tables
    const joinQuery = db
      .select({
        job: jobs
      })
      .from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .where(eq(savedJobs.userId, userId))
      .orderBy(desc(savedJobs.createdAt))
      .limit(limit)
      .offset(offset);
    
    const joinResult = await joinQuery.execute();
    
    // Extract the job data from the join result
    const savedJobsList = joinResult.map(row => row.job);
    
    // Count total saved jobs for this user
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedJobs)
      .where(eq(savedJobs.userId, userId))
      .execute();
    
    const total = Number(countResult[0]?.count || 0);
    
    return {
      data: savedJobsList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // Job Sources methods
  async getJobSources(page: number, limit: number): Promise<{ data: JobSource[], total: number, page: number, limit: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    
    // Get approved job sources
    const sourcesList = await db
      .select()
      .from(jobSources)
      .where(eq(jobSources.approved, true))
      .orderBy(desc(jobSources.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Count total approved sources
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobSources)
      .where(eq(jobSources.approved, true))
      .execute();
    
    const total = Number(countResult[0]?.count || 0);
    
    return {
      data: sourcesList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createJobSource(sourceData: InsertJobSource): Promise<JobSource> {
    const [source] = await db
      .insert(jobSources)
      .values({
        ...sourceData,
        approved: false,
        createdAt: new Date()
      })
      .returning();
    return source;
  }
  
  // Notification methods
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
      .execute();
    
    return Number(countResult[0]?.count || 0);
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id));
    return notification || undefined;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...notificationData,
        read: false,
        createdAt: new Date()
      })
      .returning();
    return notification;
  }
}

// Initialize seed data function for the database
async function seedDatabase() {
  try {
    // Check if there are any jobs in the database
    const jobCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .execute();
    
    // If no jobs exist, add the mock data
    if (Number(jobCount[0]?.count || 0) === 0) {
      console.log("Seeding database with initial job data...");
      
      // Add sample jobs from mock data
      await db.insert(jobs).values(mockJobs);
      
      console.log("Jobs seeded successfully!");
    }
    
    // Check if there are any job sources in the database
    const sourceCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobSources)
      .execute();
    
    // If no sources exist, add the mock data
    if (Number(sourceCount[0]?.count || 0) === 0) {
      console.log("Seeding database with initial job sources...");
      
      // Add sample job sources from mock data
      await db.insert(jobSources).values(mockJobSources);
      
      console.log("Job sources seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();

// Seed the database when the server starts
seedDatabase().catch(console.error);
