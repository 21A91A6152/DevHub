import { Request, Response } from "express";
import prisma from "../../db";
import {
  contactUsSchema ,
  otpVerificationSchema ,
  signinBodySchema ,
  signupBodySchema , UpdateBodySchema ,
} from "./zodSchema";
import { createHash, validatePassword } from "../../helpers/hash";
import { createJWT } from "../../helpers/jwt";
import { UserAuthRequest } from "../../helpers/types";
import crypto from "crypto";
import { sendVerificationEmail } from "../../helpers/mail/sendOtpMail";
import { sendWelcomeEmail } from "../../helpers/mail/sendWelcomeMail";
import { date } from "zod";
import{ mailing} from "../../helpers/mail/ContactUsMail";
export const userSignupController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = signupBodySchema.safeParse(payload);

    if (!result.success) {
      const formattedError: any = {};
      result.error.errors.forEach((e) => {
        formattedError[e.path[0]] = e.message;
      });
      return res.status(411).json({
        error: { ...formattedError, message: "" },
      });
    }

    const data = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(411).json({
        error: {
          message: "Email already in use.",
        },
      });
    }

    const passwordHash = await createHash(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        username: data.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    await sendWelcomeEmail(user.email, user.username);

    const token = createJWT({
      id: user.id,
      username: user.username,
    });

    res.status(201).json({
      message: "User created Successfully.",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: "An unexpected exception occurred!",
      },
    });
  }
};

export const userSigninController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = signinBodySchema.safeParse(payload);

    if (!result.success) {
      const formattedError: any = {};
      result.error.errors.forEach((e) => {
        formattedError[e.path[0]] = e.message;
      });
      return res.status(411).json({
        error: { ...formattedError, message: "" },
      });
    }

    const data = result.data;

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(411).json({
        error: {
          message: "No such user exists",
        },
      });
    }

    const matchPassword = await validatePassword(
      data.password,
      user.passwordHash
    );

    if (!matchPassword) {
      return res.status(411).json({
        error: {
          message: "Wrong Password",
        },
      });
    }

    const token = createJWT({
      id: user.id,
      username: user.username,
    });

    res.status(201).json({
      message: "User logged in Successfully.",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: "An unexpected exception occurred!",
      },
    });
  }
};

export const userProfileController = async (req: UserAuthRequest, res: Response) => {
  const userId = req.userId;


  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      twitter:true,
      avatar:true,
      github:true,
      linkedin:true,
      portfolio:true,
      posts: {
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
          author: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      },
      verified: true,
      _count: {
        select: { following: true },
      }
    },
  });

  if (!user) {
    return res.status(411).json({
      error: "Invalid token",
    });
  }

  res.status(200).json({
    user,
  });
};

export const userProfileUpdate = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const payload = req.body;
    const result = UpdateBodySchema.safeParse(payload);

    if (!result.success) {
      const formattedError: any = {};
      result.error.errors.forEach((e) => {
        formattedError[e.path[0]] = e.message;
      });
      return res.status(411).json({
        error: { ...formattedError, message: "" },
      });
    }

    const data = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(411).json({
        error: {
          message: "Email already in use.",
        },
      });
    }

    const userEmail = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: data.username,
        email: data.email,
        twitter: data.twitter,
        github: data.github,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        avatar: data.avatar
      },
    });

    if (userEmail?.email != data.email) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verified: false,
        },
      });
    }

    res.status(201).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error,
      },
    });
  }
};


export const showUserProfileController = async (req: UserAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        avatar:true,
        createdAt: true,
        twitter:true,
        github:true,
        linkedin:true,
        portfolio:true,
        posts: {
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            author: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        },
        verified: true,
        _count: {
          select: { following: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      error: "An unexpected error occurred!",
    });
  }
};


export const generateOtpController = async (
  req: UserAuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        posts: true,
        verified: true,
      },
    });

    if (!user) {
      return res.status(411).json({
        error: "Invalid token",
      });
    }

    if (user.verified) {
      return res.status(411).json({
        message: "User already verified",
      });
    }

    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        otp: otp,
      }
    });

    await sendVerificationEmail(user.email, otp);

    res.status(201).json({
      message: "OTP sent Successfully.",
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    return res.status(500).json({
      error: { message: "An unexpected error occurred." },
    });
  }
};

export const verifyOtpController = async (
  req: UserAuthRequest,
  res: Response
) => {
  try {
    const payload = req.body;
    const result = otpVerificationSchema.safeParse(payload);

    if (!result.success) {
      const formattedError: any = {};
      result.error.errors.forEach((e) => {
        formattedError[e.path[0]] = e.message;
      });
      return res.status(400).json({
        error: { ...formattedError, message: "Validation error." },
      });
    }

    const { otp } = result.data;
    const usedId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: usedId },
      select: {
        id: true,
        otp: true,
        createdAt: true,
        updatedAt: true
      },
    });

    if (!user) {
      return res.status(404).json({
        error: { message: "User not found." },
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        error: { message: "Invalid OTP." },
      });
    }

    const otpAge = Date.now() - new Date(user.updatedAt).getTime();
    const otpExpiry = 10 * 60 * 1000; // 10 minutes

    if (otpAge > otpExpiry) {
      return res.status(400).json({
        error: { message: "OTP has expired." },
      });
    }
    await prisma.user.update({
      where: { id: usedId },
      data: {
        otp: null,
        verified: true
      },
    });

    return res.status(200).json({
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      error: { message: "An unexpected error occurred." },
    });
  }
};

export const contactUsController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = contactUsSchema.safeParse(payload); 
    if (!result.success) {
      const formattedError: any = {};
      result.error.errors.forEach((e) => {
        formattedError[e.path[0]] = e.message;
      });
      return res.status(400).json({
        error: { ...formattedError, message: "Validation error." },
      });
    }

    const data = result.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    });  
    if (result.data?.email && result.data?.message) {
      await mailing(result.data.email, result.data.message);
    }
    
    res.status(201).json({
      message: "Your message has been received. We will get back to you shortly.",
      contactMessage,
    });
  } catch (error) {
    console.log("Contact Us form submission error: ", error);
    return res.status(500).json({
      error: "An unexpected error occurred!",
    });
  }
};

export const followUserController = async (req: UserAuthRequest, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id; 

    if (followerId === followingId) {
      return res.status(400).json({
        error: "You cannot follow yourself.",
      });
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingFollow) {
      return res.status(400).json({
        error: "You are already following this user.",
      });
    }

    await prisma.follow.create({
      data: {
        follower: { connect: { id: followerId } },
        following: { connect: { id: followingId } },
      },
    });

    const followerCount = await prisma.follow.count({
      where: { followingId },
    });

    res.status(201).json({
      message: "User followed successfully.",
      followersCount: followerCount,
    });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({
      error: {
        message: "An unexpected error occurred.",
      },
    });
  }
};

export const unfollowUserController = async (req: UserAuthRequest, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id; 

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (!existingFollow) {
      return res.status(400).json({
        error: "You are not following this user.",
      });
    }

    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    const followerCount = await prisma.follow.count({
      where: { followingId },
    });

    res.status(200).json({
      message: "User unfollowed successfully.",
      followersCount: followerCount,
    });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({
      error: {
        message: "An unexpected error occurred.",
      },
    });
  }
};


export const checkFollowStatusController = async (req: UserAuthRequest, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    res.status(200).json({
      isFollowing: !!existingFollow,
    });
  } catch (error) {
    console.error("Check follow status error:", error);
    res.status(500).json({
      error: {
        message: "An unexpected error occurred.",
      },
    });
  }
};

export const checkingBlockOrUnblock = async (req: UserAuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ blocked: user.blocked });
  } catch (error) {
    console.error("Error checking blocked status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createFeedback = async (req: UserAuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.userId; 

    if (!rating || !comment || !userId) {
      return res.status(400).json({ error: 'Rating and comment are required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        userId,
      },
    });

    res.status(201).json({
      message: 'Feedback created successfully.',
      feedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'An unexpected error occurred!' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where:{
        visible:true
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'An unexpected error occurred!' });
  }
};