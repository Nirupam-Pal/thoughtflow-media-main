import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioProjectBySlug } from "@/data/portfolioData";
import Seo from "@/components/Seo";
import { getProjectSeo } from "@/seo/site.js";
import { VideoCaseStudy } from "@/components/case-study/VideoCaseStudy";
import { DesignCaseStudy } from "@/components/case-study/DesignCaseStudy";
import { GalleryCaseStudy } from "@/components/case-study/GalleryCaseStudy";

/**
 * One case-study page per portfolio project. The layout follows the project's content:
 * videos → VideoCaseStudy, design sections → DesignCaseStudy, a photo gallery → GalleryCaseStudy.
 */
const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = getPortfolioProjectBySlug(slug);

  useEffect(() => {
    if (!project) {
      navigate("/404", { replace: true });
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  const hasVideos = !!project.videoSections?.length;
  const hasDesigns = !!project.imageSections?.some((s) => s.images.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background min-w-0 w-full max-w-[100vw] overflow-x-clip">
      <Seo {...getProjectSeo(project)} />
      <Header />
      {hasVideos ? (
        <VideoCaseStudy project={project} />
      ) : hasDesigns ? (
        <DesignCaseStudy project={project} />
      ) : (
        <GalleryCaseStudy project={project} />
      )}
      <Footer />
    </div>
  );
};

export default PortfolioDetail;
