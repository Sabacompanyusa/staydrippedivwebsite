/**
 * Stay Dripped Mobile IV - Main JavaScript
 * Handles core website functionality, animations, and user interactions
 * Copyright © 2025 Stay Dripped Mobile IV LLC
 */

// =============================================
// CORE WEBSITE FUNCTIONALITY
// =============================================

class StayDrippedApp {
  constructor() {
    this.init();
  }

  init() {
    this.initializeScrollProgress();
    this.initializeNavigation();
    this.initializeTestimonialSlider();
    this.initializeAnimations();
    this.initializeLazyLoading();
    this.initializePerformanceOptimizations();
    this.bindGlobalEvents();
  }

  // =============================================
  // SCROLL PROGRESS INDICATOR
  // =============================================

  initializeScrollProgress() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
