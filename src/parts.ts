export type PartType = 'Brain' | 'Joint' | 'Energy' | 'Sensor' | 'Frame';

export interface RobotPart {
    id: string;
    name: string;
    realName: string;
    type: PartType;
    description: string;
    image: string;
    requiredFor: string[];
}

export const PART_LIBRARY: RobotPart[] = [
    {
        id: 'uno-r4',
        name: 'Brain',
        realName: 'Arduino Uno R4 WiFi',
        type: 'Brain',
        description: 'The industry standard for learning. Robust and easy to wire.',
        image: 'https://placehold.co/100x100/1a1a2e/00d2ff?text=Uno+R4',
        requiredFor: ['learning', 'prototyping']
    },
    {
        id: 'esp32-devkit',
        name: 'Brain',
        realName: 'ESP32 Dev Kit V1',
        type: 'Brain',
        description: 'Powerful dual-core processor with built-in Wi-Fi and Bluetooth.',
        image: 'https://placehold.co/100x100/1a1a2e/00d2ff?text=ESP32',
        requiredFor: ['iot', 'home-automation']
    },
    {
        id: 'rpi4',
        name: 'Brain',
        realName: 'Raspberry Pi 4',
        type: 'Brain',
        description: 'High-performance computer for complex AI and computer vision tasks.',
        image: '/assets/brain_rpi.png',
        requiredFor: ['autonomous-driving', 'object-recognition']
    },
    {
        id: 'arduino-nano',
        name: 'Brain',
        realName: 'Arduino Nano ESP32',
        type: 'Brain',
        description: 'Lightweight microcontroller for simple motor control and sensory logic.',
        image: '/assets/brain_arduino.png',
        requiredFor: ['remote-control', 'sensor-monitoring']
    },
    {
        id: 'servo-mg996r',
        name: 'Joint',
        realName: 'MG996R Servo',
        type: 'Joint',
        description: 'Standard high-torque servo for precise angular movement.',
        image: '/assets/joint_servo.png',
        requiredFor: ['robotic-arm', 'steering']
    },
    {
        id: 'stepper-nema17',
        name: 'Joint',
        realName: 'NEMA 17 Stepper',
        type: 'Joint',
        description: 'High-precision motor for continuous rotation and position control.',
        image: '/assets/joint_stepper.png',
        requiredFor: ['cnc-movement', 'heavy-lifting']
    },
    {
        id: 'lipo-3s',
        name: 'Energy Source',
        realName: '3S LiPo Battery',
        type: 'Energy',
        description: 'High-density power source for high-current motors.',
        image: '/assets/energy_lipo.png',
        requiredFor: ['mobile-robot', 'high-power']
    },
    {
        id: 'wall-adapter',
        name: 'Energy Source',
        realName: '12V 5A DC Wall Adapter',
        type: 'Energy',
        description: 'Continuous power from an outlet. Perfect for stationary robots.',
        image: 'https://placehold.co/100x100/1a1a2e/39ff14?text=Wall+Adapter',
        requiredFor: ['stationary-robot']
    },
    {
        id: 'lidar-tfmini',
        name: 'Sensor',
        realName: 'TFMini Plus Lidar',
        type: 'Sensor',
        description: 'High-precision laser distance sensor for fast-moving obstacles.',
        image: 'https://placehold.co/100x100/1a1a2e/9d50bb?text=Lidar',
        requiredFor: ['autonomous-drone', 'mapping']
    },
    {
        id: 'ultrasonic',
        name: 'Sensor',
        realName: 'HC-SR04 Ultrasonic',
        type: 'Sensor',
        description: 'Measures distance using sound waves to avoid obstacles.',
        image: 'https://placehold.co/100x100/1a1a2e/9d50bb?text=Ultrasonic',
        requiredFor: ['obstacle-avoidance']
    },
    {
        id: 'carbon-fiber',
        name: 'Frame',
        realName: 'Carbon Fiber Plate',
        type: 'Frame',
        description: 'Ultralight and extremely strong structural material.',
        image: 'https://placehold.co/100x100/1a1a2e/ff3131?text=Carbon+Plate',
        requiredFor: ['high-performance']
    },
    {
        id: 'alum-rail',
        name: 'Frame',
        realName: '2020 Aluminum Rail',
        type: 'Frame',
        description: 'Sturdy structural backbone for heavy industrial robots.',
        image: 'https://placehold.co/100x100/1a1a2e/ff3131?text=Alum+Rail',
        requiredFor: ['heavy-structure']
    }
];
