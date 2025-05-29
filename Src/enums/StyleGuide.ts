enum PRIMARY_LIGHT_COLORS {
    // Primary = '#FFC300',
    Primary = '#FFA500',
    // Secondary = '#0866ff'
    Secondary='#003366',
    Accent = '#FF5733',
    Background = '#F5F5F5',
    TextPrimary = '#333333',
    TextSecondary = '#F5F5F5',
    IconText = '#F5F5F5',
    black='#000',
    TextPrimarywhite= '#F5F5F5',
    white="#FFFFFF"
}

enum PRIMARY_DARK_COLORS {
    // Primary = '#FFC300',
    Primary = '#FFA500',

    // Secondary = '#2C3E50',
    Secondary='#003366',
    Accent = '#00D9FF',
	Background = '#1C1C1C',
	TextPrimary= '#F5F5F5',
    TextSecondary = '#333333',
    IconText = '#F5F5F5',
    // IconText = '#C7C6C6',
    TextPrimarywhite= '#F5F5F5',
white="#FFFFFF"
}

enum SIZES {
    borderRadius = 10
}

enum FONT_FAMILY {
    regularFont = 'Poppins Regular',
    boldFont = 'Poppins-bold'
}

const theme = {
    light: { ...PRIMARY_LIGHT_COLORS },
    dark: { ...PRIMARY_DARK_COLORS }
}

export { PRIMARY_DARK_COLORS, PRIMARY_LIGHT_COLORS, theme, SIZES, FONT_FAMILY }