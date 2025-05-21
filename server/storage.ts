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

export const storage = new MemStorage();
