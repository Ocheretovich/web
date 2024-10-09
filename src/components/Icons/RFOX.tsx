import { createIcon } from '@chakra-ui/react'

export const RFOXIcon = createIcon({
  displayName: 'RFOX Icon',
  path: (
    <>
      <defs>
        <linearGradient id='rfoxGradient' gradientTransform='rotate(45)'>
          <stop offset='0%' stop-color='#3761F9' />
          <stop offset='100%' stop-color='#62FFFF' />
        </linearGradient>
      </defs>
      <path
        d='M12.0091 20.1534L12.092 20.2488L12.2527 20.0641C13.7106 18.386 15.413 16.941 17.3007 15.7805L17.3044 15.7783L19.9758 14.1445L19.4031 12.3019C18.9743 10.9223 18.8743 9.46155 19.1111 8.0364L19.813 3.811L17.1795 4.86305C16.0869 5.29952 14.9211 5.52376 13.7445 5.52376H10.135C8.89731 5.52376 7.67216 5.27561 6.53199 4.79399L4.32437 3.86145L4.99642 7.94133C5.24327 9.43991 5.1177 10.9762 4.63077 12.4148L4.0441 14.1482L6.76425 15.7542C7.06591 15.9351 7.36295 16.1232 7.65515 16.3183L10.7157 12.995L8.46604 10.7172C8.31361 10.5629 8.24774 10.343 8.29024 10.1303C8.33274 9.91757 8.47806 9.73983 8.67809 9.65592L16.1688 6.51386C16.4454 6.39782 16.7655 6.48515 16.9449 6.72559C17.1243 6.96604 17.1169 7.29778 16.9269 7.52992L12.4958 12.9431L14.7708 15.25C14.923 15.4043 14.9887 15.624 14.9463 15.8365C14.9039 16.0489 14.7589 16.2266 14.5593 16.3107L6.06313 19.8884C5.77993 20.0077 5.4519 19.9134 5.27522 19.662C5.09854 19.4106 5.121 19.07 5.32917 18.844L6.38383 17.6988C6.19526 17.5768 6.00457 17.458 5.81183 17.3424L2.45529 15.3607C2.07808 15.138 1.90854 14.6814 2.04898 14.2665L2.87665 11.8211C3.26619 10.6702 3.36665 9.44118 3.16917 8.24231L2.2242 2.50558C2.1057 1.7862 2.82652 1.21843 3.49812 1.50212L7.2526 3.08807C8.16473 3.47337 9.14485 3.67189 10.135 3.67189H13.7445C14.6858 3.67189 15.6184 3.4925 16.4925 3.14332L20.6523 1.48156C21.3223 1.21391 22.0275 1.78144 21.9092 2.49317L20.9379 8.33989C20.7485 9.48001 20.8285 10.6486 21.1715 11.7523L21.9582 14.2835C22.084 14.6884 21.9188 15.127 21.5571 15.3482L18.2706 17.3581C16.5436 18.4198 14.9858 19.7417 13.6507 21.2786L12.7906 22.2676C12.4215 22.6921 11.7622 22.692 11.3931 22.2675L10.6115 21.3684C10.2258 20.9249 9.82161 20.4993 9.40016 20.0928L11.2428 19.3168C11.5051 19.5887 11.7606 19.8677 12.0091 20.1534Z'
        fill='currentColor'
      />
    </>
  ),
  viewBox: '0 0 24 24',
})
