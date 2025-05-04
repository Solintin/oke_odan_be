// src/services/overview.service.ts

import ProjectModel from "@src/db/model/project.model";
import AnouncementModel from "@src/db/model/announcementmodel.model";
import UserModel from "@src/db/model/user.model";
import DonationModel from "@src/db/model/donation.model";
import { PostEnum } from "@src/interfaces/enum.interface";

export const getOverviewMetrics = async () => {
  const [
    projectsResult,
    announcementsResult,
    usersResult,
    donationsResult,
    executiveMembersResult,
  ] = await Promise.all([
    ProjectModel.aggregate([{ $count: "count" }]),
    AnouncementModel.aggregate([{ $count: "count" }]),
    UserModel.aggregate([{ $count: "count" }]),
    DonationModel.aggregate([{ $count: "count" }]),
    UserModel.aggregate([
      { $match: { post: { $ne: PostEnum.MEMBER } } },
      { $count: "count" },
    ]),
  ]);

  return {
    projects: projectsResult[0]?.count || 0,
    announcements: announcementsResult[0]?.count || 0,
    users: usersResult[0]?.count || 0,
    donations: donationsResult[0]?.count || 0,
    executiveMembers: executiveMembersResult[0]?.count || 0,
  };
};
