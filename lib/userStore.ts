import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

interface User {
    _id: string
    name: string
    email: string
    phone: string
    password: string
    createdAt: string
    role: 'admin' | 'user'
}

const usersFile = path.join(process.cwd(), 'lib', 'users.json')

// Ensure users file exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]')
}

export class UserStore {
    private users: User[] = []

    constructor() {
        this.loadUsers()
    }

    private loadUsers() {
        try {
            const data = fs.readFileSync(usersFile, 'utf8')
            this.users = JSON.parse(data)
        } catch (error) {
            console.error('Error loading users:', error)
            this.users = []
        }
    }

    private saveUsers() {
        try {
            fs.writeFileSync(usersFile, JSON.stringify(this.users, null, 2))
        } catch (error) {
            console.error('Error saving users:', error)
        }
    }

    async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
        const existingUser = this.users.find(u => u.email === userData.email)
        if (existingUser) {
            throw new Error('کاربری با این ایمیل قبلاً ثبت شده است')
        }

        const user: User = {
            _id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            role: userData.role || 'user',
        }

        this.users.push(user)
        this.saveUsers()
        return user
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findUserByEmail(email)
    }

    async findUserById(id: string): Promise<User | null> {
        return this.users.find(u => u._id === id) || null
    }

    async validatePassword(email: string, password: string): Promise<User | null> {
        const user = await this.findUserByEmail(email)
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.password)
        return isValid ? user : null
    }

    async updateUser(userId: string, updateData: Partial<Pick<User, 'name' | 'email' | 'phone'>>): Promise<User | null> {
        const userIndex = this.users.findIndex(u => u._id === userId)
        if (userIndex === -1) {
            return null
        }

        // Update user data
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateData
        }

        this.saveUsers()
        return this.users[userIndex]
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
        const userIndex = this.users.findIndex(u => u._id === userId)
        if (userIndex === -1) {
            return null
        }

        // Update password
        this.users[userIndex] = {
            ...this.users[userIndex],
            password: hashedPassword
        }

        this.saveUsers()
        return this.users[userIndex]
    }
}

export const userStore = new UserStore() 