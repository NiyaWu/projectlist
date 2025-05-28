"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import portfolioItemsData from "@/data/portfolio-items.json"
import featuredProjectsData from "@/data/featured-projects.json"
import { useEffect, useRef, useState } from "react"
import styles from "./page.module.css"

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allDataLoaded, setAllDataLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (imageSrc: string) => {
    setImageErrors((prev) => new Set(prev).add(imageSrc))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAllDataLoaded(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const categories = [
    "Gaming",
    "NFT",
    "Infra",
    "AI",
    "ZK",
    "Chain",
    "Defi",
    "Social",
    "Audit",
    "RWA",
    "Fuel",
    "LatAm",
    "Trading",
    "Mobile",
    "Launchpad",
    "Bitcoin",
    "Identity",
    "Depin",
    "Dex",
    "Solana",
    "Stablecoin",
    "CIS",
    "Telegram",
    "Pivoted",
    "Health",
    "Privacy",
    "Monad",
    "Data",
  ]

  const filteredPortfolioItems = portfolioItemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || item.tags.some((tag) => selectedCategories.includes(tag))),
  )

  const renderSkeletonCards = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className={styles.skeletonCard}>
          <div className={styles.skeletonLogo}>
            <div className={styles.skeletonCircle}></div>
          </div>
          <div className={styles.skeletonTagsContainer}>
            <div className={styles.skeletonTag}></div>
            <div className={styles.skeletonTag}></div>
          </div>
          <div className={styles.skeletonName}></div>
          <div className={styles.skeletonWebsite}></div>
        </div>
      ))
  }

  const renderFeaturedSkeletonCards = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={`featured-skeleton-${index}`} className={styles.featuredSkeletonCard}>
          <div className={styles.featuredSkeletonLogo}>
            <div className={styles.featuredSkeletonImage}></div>
          </div>
        </div>
      ))
  }

  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !allDataLoaded) {
          setIsLoading(true)
          setTimeout(() => {
            setIsLoading(false)
            setAllDataLoaded(true)
          }, 2000)
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [allDataLoaded])

  return (
    <div className={styles.container}>
      {/* Navigation */}
      {/* Mobile Header */}
      <nav className={styles.mobileNav}>
        <div className={styles.logoContainer}>
          <div className={styles.logoTopLeft}></div>
          <div className={styles.logoTopRight}></div>
          <div className={styles.logoBottom}></div>
        </div>
      </nav>

      {/* Desktop Header */}
      <nav className={styles.desktopNav}>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.logoContainer}>
              <div className={styles.logoTopLeft}></div>
              <div className={styles.logoTopRight}></div>
              <div className={styles.logoBottom}></div>
            </div>
            <span className={styles.navLogoText}>Impossible Finance</span>
          </Link>

          <div className={styles.navLinksContainer}>
            <Link href="#" className={styles.navLink}>
              Invest
            </Link>
            <Link href="#" className={styles.navLink}>
              Trade
            </Link>
            <Link href="#" className={styles.navLink}>
              FAQ
            </Link>
            <Link href="#" className={styles.navLink}>
              Advisory
            </Link>
            <Link href="#" className={styles.activeNavLink}>
              Portfolio
            </Link>
          </div>
        </div>

        <Link href="#" className={styles.enterAppButton}>
          Enter App
        </Link>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.title}>Portfolio List</h1>

        {/* Featured Projects Section */}
        <h2 className={styles.sectionTitle}>Featured Projects</h2>

        <div className={styles.featuredGrid}>
          {isLoading
            ? renderFeaturedSkeletonCards()
            : [...featuredProjectsData].map((project) => (
                <a
                  key={project.id}
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.featuredItem}
                >
                  <div className={styles.featuredLogo}>
                    <Image
                      src={
                        imageErrors.has(project.logoUrl) ? "/placeholder.png" : project.logoUrl || "/placeholder.png"
                      }
                      alt={`${project.name} logo`}
                      width={300}
                      height={169}
                      className={styles.featuredLogoImage}
                      onError={() => handleImageError(project.logoUrl)}
                    />
                  </div>
                </a>
              ))}
        </div>

        {/* Search */}
        <h2 className={styles.sectionTitle}>All Projects</h2>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search portfolio"
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>

        {/* Categories */}
        <div className={styles.categoriesContainer}>
          <button
            key="all"
            className={`${styles.categoryButton} ${selectedCategories.length === 0 ? styles.activeCategoryButton : ""}`}
            onClick={() => setSelectedCategories([])}
          >
            All
          </button>
          {categories.map((category, index) => {
            const isActive = selectedCategories.includes(category)
            return (
              <button
                key={index}
                className={`${styles.categoryButton} ${isActive ? styles.activeCategoryButton : ""}`}
                onClick={() => {
                  if (isActive) {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category))
                  } else {
                    setSelectedCategories([...selectedCategories, category])
                  }
                }}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Portfolio Grid */}
        <div className={styles.portfolioGrid}>
          {isLoading ? (
            renderSkeletonCards()
          ) : filteredPortfolioItems.length === 0 ? (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No results found. Try a different keyword.</p>
            </div>
          ) : (
            <>
              {filteredPortfolioItems
                .sort((a, b) => {
                  const nameA = a.name.replace(/[^\w\s]/gi, "").toLowerCase()
                  const nameB = b.name.replace(/[^\w\s]/gi, "").toLowerCase()
                  return nameA.localeCompare(nameB)
                })
                .map((item, index) => (
                  <a
                    key={index}
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.portfolioItem}
                  >
                    <div className={styles.portfolioLogo}>
                      <Image
                        src={imageErrors.has(item.logoUrl) ? "/placeholder.png" : item.logoUrl || "/placeholder.png"}
                        alt={`${item.name} logo`}
                        width={100}
                        height={100}
                        className={styles.portfolioLogoImage}
                        onError={() => handleImageError(item.logoUrl)}
                      />
                    </div>
                    <div className={styles.tagsContainer}>
                      {item.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={styles.portfolioName}>{item.name}</span>
                    {/* <span className={styles.portfolioWebsite}>{item.website}</span> */}
                  </a>
                ))}
              {allDataLoaded && (
                <div className={styles.noMoreResults}>
                  <p className={styles.noMoreResultsText}>No more results</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
