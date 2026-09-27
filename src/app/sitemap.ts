import { MetadataRoute } from 'next';
import { prisma } from '@/backend/prisma';

export const dynamic = 'force-dynamic'; // Ensures sitemap stays up to date

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://akshayamtamilmatrimony.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let profileUrls: MetadataRoute.Sitemap = [];
  try {
    const approvedProfiles = await prisma.profile.findMany({
      where: { isApproved: true },
      select: { id: true, updatedAt: true },
      take: 1000,
    });

    profileUrls = approvedProfiles.map((p) => ({
      url: `${baseUrl}/profiles/${p.id}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching profiles for sitemap:', error);
  }

  return [...staticPages, ...profileUrls];
}
