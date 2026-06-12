const User = require('../Models/User_model');
const generateToken = require('../utils/generateToken');

/**
 * 
 * AUTHENTICATION CONTROLLER
 * 
 * Handles user registration, login, profile management, and user retrieval
 */

/**
 * Register a new user account
 * @desc Create a new user with initial virtual funds
 * @route POST /api/auth/register
 * @access Public (anyone can register)
 */
const register = async (req, res, next) => {
 try {
 const { username, email, password, role } = req.body;

 // Validate required fields
 if (!username || !email || !password) {
 return res.status(400).json({
 success: false,
 message: 'Please provide username, email, and password',
 });
 }

 // Check if user already exists (email or username)
 const existingUser = await User.findOne({ $or: [{ email }, { username }] });
 if (existingUser) {
 return res.status(400).json({
 success: false,
 message: existingUser.email === email
 ? 'This email is already registered'
 : 'This username is already taken',
 });
 }

 // Create new user with initial wallet balance
 const user = await User.create({
 username,
 email,
 password,
 role: role === 'admin' ? 'user' : (role || 'user'), // Prevent users from self-assigning admin role
 walletBalance: 10000, // Start with ₹10,000 virtual funds
 totalDeposits: 10000,
 });

 // Generate JWT token for authentication
 const token = generateToken(user._id, user.role);

 res.status(201).json({
 success: true,
 message: ' Account created successfully! You received ₹10,000 virtual funds to start trading.',
 data: {
 _id: user._id,
 username: user.username,
 email: user.email,
 role: user.role,
 walletBalance: user.walletBalance,
 totalDeposits: user.totalDeposits,
 token,
 },
 });
 } catch (error) {
 next(error);
 }
};

/**
 * Login to existing account
 * @desc Authenticate user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
 try {
 const { email, password } = req.body;

 // Validate input
 if (!email || !password) {
 return res.status(400).json({
 success: false,
 message: 'Please provide email and password',
 });
 }

 // Find user by email and explicitly select password field
 const user = await User.findOne({ email }).select('+password');
 if (!user) {
 return res.status(401).json({
 success: false,
 message: ' Invalid email or password',
 });
 }

 // Verify password matches
 const isMatch = await user.matchPassword(password);
 if (!isMatch) {
 return res.status(401).json({
 success: false,
 message: ' Invalid email or password',
 });
 }

 // Check if account is active
 if (!user.isActive) {
 return res.status(401).json({
 success: false,
 message: ' Your account has been deactivated',
 });
 }

 // Update last login timestamp
 user.lastLogin = Date.now();
 await user.save({ validateBeforeSave: false });

 // Generate JWT token
 const token = generateToken(user._id, user.role);

 res.status(200).json({
 success: true,
 message: ' Login successful',
 data: {
 _id: user._id,
 username: user.username,
 email: user.email,
 role: user.role,
 walletBalance: user.walletBalance,
 totalDeposits: user.totalDeposits,
 token,
 },
 });
 } catch (error) {
 next(error);
 }
};

/**
 * Get logged-in user's profile
 * @desc Retrieve current user's information
 * @route GET /api/auth/profile
 * @access Private (requires authentication)
 */
const getProfile = async (req, res, next) => {
 try {
 const user = await User.findById(req.user._id);
 if (!user) {
 return res.status(404).json({
 success: false,
 message: 'User not found',
 });
 }

 res.status(200).json({
 success: true,
 data: {
 _id: user._id,
 username: user.username,
 email: user.email,
 role: user.role,
 walletBalance: user.walletBalance,
 totalDeposits: user.totalDeposits,
 createdAt: user.createdAt,
 lastLogin: user.lastLogin,
 isActive: user.isActive,
 },
 });
 } catch (error) {
 next(error);
 }
};

/**
 * Update user profile
 * @desc Modify user's username, email, or password
 * @route PUT /api/auth/profile
 * @access Private (requires authentication)
 */
const updateProfile = async (req, res, next) => {
 try {
 const user = await User.findById(req.user._id).select('+password');
 if (!user) {
 return res.status(404).json({
 success: false,
 message: 'User not found',
 });
 }

 const { username, email, password } = req.body;

 // Update username if provided
 if (username) user.username = username;

 // Update email if provided
 if (email) user.email = email;

 // Update password if provided
 if (password) {
 if (password.length < 6) {
 return res.status(400).json({
 success: false,
 message: 'Password must be at least 6 characters long',
 });
 }
 user.password = password;
 }

 // Save updated user and generate new token
 const updated = await user.save();
 const token = generateToken(updated._id, updated.role);

 res.status(200).json({
 success: true,
 message: ' Profile updated successfully',
 data: {
 _id: updated._id,
 username: updated.username,
 email: updated.email,
 role: updated.role,
 walletBalance: updated.walletBalance,
 token,
 },
 });
 } catch (error) {
 next(error);
 }
};

/**
 * Get all users (Admin only)
 * @desc Retrieve list of all registered users
 * @route GET /api/auth/users
 * @access Private/Admin (requires admin authentication)
 */
const getAllUsers = async (req, res, next) => {
 try {
 const users = await User.find({})
 .select('-password') // Exclude password field for security
 .sort({ createdAt: -1 }); // Sort by most recent first

 res.status(200).json({
 success: true,
 count: users.length,
 data: users,
 });
 } catch (error) {
 next(error);
 }
};

module.exports = { register, login, getProfile, updateProfile, getAllUsers };
