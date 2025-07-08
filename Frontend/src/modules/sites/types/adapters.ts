import { CreateSiteRequest, SiteDto, UpdateSiteRequest } from "@/api/generated/model";
import { Site } from "./site";



export const siteDtoToSite = (dto: SiteDto): Site => ({
  id: dto.id!,
  href: dto.href!,
  name: dto.name!,
  description: dto.description!
});

export const siteToCreateReq = (site: Site): CreateSiteRequest => ({
  href: site.href,
  name: site.name,
  description: site.description
});

export const siteToUpdateReq = (site: Site): UpdateSiteRequest => ({
  href: site.href,
  name: site.name,
  description: site.description
});
