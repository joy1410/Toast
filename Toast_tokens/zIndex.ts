// Figma Foundations — Z-Index Scale

export const zIndex = {
  behind:  '-1',
  base:     '0',
  raised:   '10',
  dropdown: '100',
  sticky:   '200',
  overlay:  '300',
  modal:    '400',
  toast:    '500',  // Toast notification layer (above modals)
  top:      '9999',
} as const

export type ZIndexToken = keyof typeof zIndex
