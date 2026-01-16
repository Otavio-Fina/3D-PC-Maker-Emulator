import { Component } from '../models/Component'
import { createError } from '../middleware/errorHandler'

interface CompatibilityIssue {
  component: string
  issue: string
  severity: 'error' | 'warning' | 'info'
  solution?: string
}

interface CompatibilityResult {
  isCompatible: boolean
  score: number
  issues: CompatibilityIssue[]
  recommendations: string[]
}

interface ComponentCompatibility {
  component: Component
  compatibleComponents: Component[]
  incompatibleComponents: Component[]
  recommendations: string[]
}

export class CompatibilityService {
  
  // Analyze full build compatibility
  async analyzeBuild(components: Component[]): Promise<CompatibilityResult> {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    // Group components by category
    const componentMap = this.groupComponentsByCategory(components)
    
    // Check CPU-Motherboard compatibility
    if (componentMap.cpu && componentMap.motherboard) {
      const cpuMotherboardCompatibility = this.checkCPUMotherboardCompatibility(
        componentMap.cpu,
        componentMap.motherboard
      )
      issues.push(...cpuMotherboardCompatibility.issues)
      recommendations.push(...cpuMotherboardCompatibility.recommendations)
    }
    
    // Check Memory-Motherboard compatibility
    if (componentMap.ram && componentMap.motherboard) {
      const ramMotherboardCompatibility = this.checkRAMMotherboardCompatibility(
        componentMap.ram,
        componentMap.motherboard
      )
      issues.push(...ramMotherboardCompatibility.issues)
      recommendations.push(...ramMotherboardCompatibility.recommendations)
    }
    
    // Check GPU compatibility
    if (componentMap.gpu && componentMap.motherboard) {
      const gpuCompatibility = this.checkGPUCompatibility(
        componentMap.gpu,
        componentMap.motherboard
      )
      issues.push(...gpuCompatibility.issues)
      recommendations.push(...gpuCompatibility.recommendations)
    }
    
    // Check Power Supply adequacy
    if (componentMap.psu && components.length > 0) {
      const psuCompatibility = this.checkPSUAdequacy(
        componentMap.psu,
        components
      )
      issues.push(...psuCompatibility.issues)
      recommendations.push(...psuCompatibility.recommendations)
    }
    
    // Check Storage compatibility
    if (componentMap.storage && componentMap.motherboard) {
      const storageCompatibility = this.checkStorageCompatibility(
        componentMap.storage,
        componentMap.motherboard
      )
      issues.push(...storageCompatibility.issues)
      recommendations.push(...storageCompatibility.recommendations)
    }
    
    // Check Cooling compatibility
    if (componentMap.cooling && componentMap.cpu) {
      const coolingCompatibility = this.checkCoolingCompatibility(
        componentMap.cooling,
        componentMap.cpu
      )
      issues.push(...coolingCompatibility.issues)
      recommendations.push(...coolingCompatibility.recommendations)
    }
    
    // Calculate compatibility score
    const score = this.calculateCompatibilityScore(issues)
    const isCompatible = !issues.some(issue => issue.severity === 'error')
    
    return {
      isCompatible,
      score,
      issues,
      recommendations
    }
  }
  
  // Get compatible motherboards for CPU
  async getCompatibleMotherboards(cpuId: number): Promise<ComponentCompatibility> {
    const cpu = await Component.findByPk(cpuId)
    if (!cpu) {
      throw createError('CPU not found', 404)
    }
    
    const allMotherboards = await Component.findAll({
      where: { category: 'motherboard', isActive: true }
    })
    
    const compatible: Component[] = []
    const incompatible: Component[] = []
    
    for (const motherboard of allMotherboards) {
      const compatibility = this.checkCPUMotherboardCompatibility(cpu, motherboard)
      if (compatibility.issues.some(issue => issue.severity === 'error')) {
        incompatible.push(motherboard)
      } else {
        compatible.push(motherboard)
      }
    }
    
    return {
      component: cpu,
      compatibleComponents: compatible,
      incompatibleComponents: incompatible,
      recommendations: this.getMotherboardRecommendations(cpu)
    }
  }
  
  // Get compatible cooling for CPU
  async getCompatibleCooling(cpuId: number): Promise<ComponentCompatibility> {
    const cpu = await Component.findByPk(cpuId)
    if (!cpu) {
      throw createError('CPU not found', 404)
    }
    
    const allCooling = await Component.findAll({
      where: { category: 'cooling', isActive: true }
    })
    
    const compatible: Component[] = []
    const incompatible: Component[] = []
    
    for (const cooling of allCooling) {
      const compatibility = this.checkCoolingCompatibility(cooling, cpu)
      if (compatibility.issues.some(issue => issue.severity === 'error')) {
        incompatible.push(cooling)
      } else {
        compatible.push(cooling)
      }
    }
    
    return {
      component: cpu,
      compatibleComponents: compatible,
      incompatibleComponents: incompatible,
      recommendations: this.getCoolingRecommendations(cpu)
    }
  }
  
  // Get recommended PSU for GPU
  async getRecommendedPSU(gpuId: number): Promise<Component[]> {
    const gpu = await Component.findByPk(gpuId)
    if (!gpu) {
      throw createError('GPU not found', 404)
    }
    
    const gpuPowerRequirement = this.getGPUPowerRequirement(gpu)
    const recommendedPSUWattage = gpuPowerRequirement + 200 // Add 200W buffer
    
    const allPSUs = await Component.findAll({
      where: { 
        category: 'psu', 
        isActive: true 
      },
      order: [['price', 'ASC']]
    })
    
    return allPSUs.filter((psu: Component) => {
      const psuWattage = this.getPSUWattage(psu)
      return psuWattage >= recommendedPSUWattage
    })
  }
  
  // Get compatible memory for motherboard
  async getCompatibleMemory(motherboardId: number): Promise<ComponentCompatibility> {
    const motherboard = await Component.findByPk(motherboardId)
    if (!motherboard) {
      throw createError('Motherboard not found', 404)
    }
    
    const allRAM = await Component.findAll({
      where: { category: 'ram', isActive: true }
    })
    
    const compatible: Component[] = []
    const incompatible: Component[] = []
    
    for (const ram of allRAM) {
      const compatibility = this.checkRAMMotherboardCompatibility(ram, motherboard)
      if (compatibility.issues.some(issue => issue.severity === 'error')) {
        incompatible.push(ram)
      } else {
        compatible.push(ram)
      }
    }
    
    return {
      component: motherboard,
      compatibleComponents: compatible,
      incompatibleComponents: incompatible,
      recommendations: this.getMemoryRecommendations(motherboard)
    }
  }
  
  // Get compatible storage for motherboard
  async getCompatibleStorage(motherboardId: number): Promise<ComponentCompatibility> {
    const motherboard = await Component.findByPk(motherboardId)
    if (!motherboard) {
      throw createError('Motherboard not found', 404)
    }
    
    const allStorage = await Component.findAll({
      where: { category: 'storage', isActive: true }
    })
    
    const compatible: Component[] = []
    const incompatible: Component[] = []
    
    for (const storage of allStorage) {
      const compatibility = this.checkStorageCompatibility(storage, motherboard)
      if (compatibility.issues.some(issue => issue.severity === 'error')) {
        incompatible.push(storage)
      } else {
        compatible.push(storage)
      }
    }
    
    return {
      component: motherboard,
      compatibleComponents: compatible,
      incompatibleComponents: incompatible,
      recommendations: this.getStorageRecommendations(motherboard)
    }
  }
  
  // Get compatibility requirements for category
  async getCompatibilityRequirements(category: string): Promise<any> {
    const requirements: Record<string, any> = {
      cpu: {
        socket: ['LGA1700', 'LGA1200', 'AM4', 'AM5'],
        tdp: { min: 65, max: 250 },
        memory: ['DDR4', 'DDR5']
      },
      motherboard: {
        socket: ['LGA1700', 'LGA1200', 'AM4', 'AM5'],
        memorySlots: { min: 2, max: 4 },
        maxMemory: { min: 64, max: 128 },
        formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX']
      },
      gpu: {
        powerConnectors: ['6-pin', '8-pin', '12-pin'],
        length: { min: 200, max: 400 },
        powerRequirement: { min: 150, max: 450 }
      },
      ram: {
        type: ['DDR4', 'DDR5'],
        speed: { min: 2666, max: 6000 },
        capacity: { min: 8, max: 32 }
      },
      storage: {
        interface: ['SATA', 'NVMe', 'M.2'],
        formFactor: ['2.5"', 'M.2'],
        capacity: { min: 256, max: 4096 }
      },
      psu: {
        wattage: { min: 450, max: 1200 },
        efficiency: ['80+', '80+ Bronze', '80+ Gold', '80+ Platinum'],
        modular: ['Fully Modular', 'Semi-Modular', 'Non-Modular']
      },
      cooling: {
        type: ['Air', 'Liquid'],
        socketSupport: ['LGA1700', 'LGA1200', 'AM4', 'AM5'],
        height: { min: 50, max: 165 }
      },
      case: {
        formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX'],
        gpuLength: { min: 300, max: 450 },
        coolerHeight: { min: 150, max: 180 }
      }
    }
    
    return requirements[category] || {}
  }
  
  // Private helper methods
  private groupComponentsByCategory(components: Component[]): Record<string, Component> {
    const grouped: Record<string, Component> = {}
    
    components.forEach(component => {
      grouped[component.category] = component
    })
    
    return grouped
  }
  
  private checkCPUMotherboardCompatibility(cpu: Component, motherboard: Component): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const cpuSocket = cpu.specifications?.socket
    const motherboardSocket = motherboard.specifications?.socket
    
    if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
      issues.push({
        component: 'CPU-Motherboard',
        issue: `CPU socket ${cpuSocket} is not compatible with motherboard socket ${motherboardSocket}`,
        severity: 'error',
        solution: `Choose a motherboard with ${cpuSocket} socket or a CPU compatible with ${motherboardSocket}`
      })
    }
    
    return { issues, recommendations }
  }
  
  private checkRAMMotherboardCompatibility(ram: Component, motherboard: Component): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const ramType = ram.specifications?.type
    const supportedMemory = motherboard.specifications?.supportedMemory || []
    
    if (ramType && !supportedMemory.includes(ramType)) {
      issues.push({
        component: 'RAM-Motherboard',
        issue: `RAM type ${ramType} is not supported by this motherboard`,
        severity: 'error',
        solution: `Choose RAM with one of the supported types: ${supportedMemory.join(', ')}`
      })
    }
    
    return { issues, recommendations }
  }
  
  private checkGPUCompatibility(gpu: Component, motherboard: Component): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const gpuLength = gpu.specifications?.length || 0
    const maxGPULength = motherboard.specifications?.maxGPULength || 300
    
    if (gpuLength > maxGPULength) {
      issues.push({
        component: 'GPU-Motherboard',
        issue: `GPU length (${gpuLength}mm) exceeds motherboard maximum (${maxGPULength}mm)`,
        severity: 'warning',
        solution: 'Check case compatibility or choose a smaller GPU'
      })
    }
    
    return { issues, recommendations }
  }
  
  private checkPSUAdequacy(psu: Component, components: Component[]): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const psuWattage = this.getPSUWattage(psu)
    const totalPowerRequirement = this.calculateTotalPowerRequirement(components)
    
    if (psuWattage < totalPowerRequirement) {
      issues.push({
        component: 'PSU',
        issue: `PSU wattage (${psuWattage}W) is insufficient for this build (requires ${totalPowerRequirement}W)`,
        severity: 'error',
        solution: `Choose a PSU with at least ${totalPowerRequirement + 100}W`
      })
    } else if (psuWattage < totalPowerRequirement + 100) {
      issues.push({
        component: 'PSU',
        issue: `PSU wattage (${psuWattage}W) may be tight for this build (requires ${totalPowerRequirement}W)`,
        severity: 'warning',
        solution: 'Consider a PSU with more wattage for future upgrades'
      })
    }
    
    return { issues, recommendations }
  }
  
  private checkStorageCompatibility(storage: Component, motherboard: Component): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const storageInterface = storage.specifications?.interface
    const supportedStorage = motherboard.specifications?.supportedStorage || []
    
    if (storageInterface && !supportedStorage.includes(storageInterface)) {
      issues.push({
        component: 'Storage-Motherboard',
        issue: `Storage interface ${storageInterface} is not supported by this motherboard`,
        severity: 'error',
        solution: `Choose storage with one of the supported interfaces: ${supportedStorage.join(', ')}`
      })
    }
    
    return { issues, recommendations }
  }
  
  private checkCoolingCompatibility(cooling: Component, cpu: Component): { issues: CompatibilityIssue[], recommendations: string[] } {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    
    const coolingSockets = cooling.specifications?.supportedSockets || []
    const cpuSocket = cpu.specifications?.socket
    
    if (cpuSocket && !coolingSockets.includes(cpuSocket)) {
      issues.push({
        component: 'Cooling-CPU',
        issue: `Cooling solution does not support CPU socket ${cpuSocket}`,
        severity: 'error',
        solution: `Choose a cooling solution that supports ${cpuSocket}`
      })
    }
    
    return { issues, recommendations }
  }
  
  private calculateCompatibilityScore(issues: CompatibilityIssue[]): number {
    let score = 100
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'error':
          score -= 25
          break
        case 'warning':
          score -= 10
          break
        case 'info':
          score -= 5
          break
      }
    })
    
    return Math.max(0, score)
  }
  
  private calculateTotalPowerRequirement(components: Component[]): number {
    return components.reduce((total, component) => {
      const powerRequirement = this.getComponentPowerRequirement(component)
      return total + powerRequirement
    }, 0)
  }
  
  private getComponentPowerRequirement(component: Component): number {
    // Default power requirements by category
    const defaults = {
      cpu: 95,
      gpu: 200,
      motherboard: 50,
      ram: 5,
      storage: 10,
      psu: 0,
      cooling: 5,
      case: 0
    }
    
    return defaults[component.category] || 0
  }
  
  private getGPUPowerRequirement(gpu: Component): number {
    return gpu.specifications?.powerRequirement || 200
  }
  
  private getPSUWattage(psu: Component): number {
    return psu.specifications?.wattage || 500
  }
  
  private getMotherboardRecommendations(cpu: Component): string[] {
    return [
      `Choose a motherboard with ${cpu.specifications?.socket} socket`,
      'Consider the number of RAM slots you need',
      'Check for required connectivity options'
    ]
  }
  
  private getCoolingRecommendations(cpu: Component): string[] {
    const cpuTDP = cpu.specifications?.tdp || 95
    const recommendations = []
    
    if (cpuTDP > 150) {
      recommendations.push('Consider liquid cooling for high TDP CPUs')
    } else {
      recommendations.push('Air cooling should be sufficient for this CPU')
    }
    
    recommendations.push(`Ensure cooling solution supports ${cpu.specifications?.socket} socket`)
    
    return recommendations
  }
  
  private getMemoryRecommendations(motherboard: Component): string[] {
    const supportedMemory = motherboard.specifications?.supportedMemory || []
    const maxMemory = motherboard.specifications?.maxMemory || 64
    
    return [
      `Choose ${supportedMemory.join(' or ')} memory`,
      `Maximum supported memory: ${maxMemory}GB`,
      'Check memory speed compatibility'
    ]
  }
  
  private getStorageRecommendations(motherboard: Component): string[] {
    const supportedStorage = motherboard.specifications?.supportedStorage || []
    
    return [
      `Choose storage with ${supportedStorage.join(' or ')} interface`,
      'Consider M.2 NVMe for better performance',
      'Check available storage slots'
    ]
  }
}
