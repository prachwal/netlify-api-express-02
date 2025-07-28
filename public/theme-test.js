// Browser theme test - paste this into browser console
window.testTheme = function () {
    console.log('=== THEME SYSTEM DEBUG ===')

    // Test 1: Check document access
    console.log('1. Document access:')
    console.log('  document:', typeof document)
    console.log('  document.documentElement:', document?.documentElement)
    console.log('  current classes:', document?.documentElement?.className)

    // Test 2: Manual class manipulation
    console.log('2. Manual class test:')
    if (document?.documentElement) {
        console.log('  Before: classes =', document.documentElement.className)
        document.documentElement.classList.add('dark')
        console.log('  After adding dark: classes =', document.documentElement.className)
        document.documentElement.classList.remove('dark')
        console.log('  After removing dark: classes =', document.documentElement.className)
    }

    // Test 3: Check if theme composable exists
    console.log('3. Theme composable test:')
    console.log('  typeof useTheme:', typeof window.useTheme)

    // Test 4: Check actual DOM elements
    console.log('4. DOM elements check:')
    const appElement = document.querySelector('[class*="min-h-screen"]')
    console.log('  App element found:', !!appElement)
    console.log('  App element classes:', appElement?.className)

    return 'Test completed - check console output above'
}

console.log('Theme test function loaded. Run: window.testTheme()')
