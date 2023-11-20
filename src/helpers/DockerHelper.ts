import { BaseHelper } from "../interfaces/BaseHelper";
import Docker, { Container, ContainerCreateOptions, ContainerInspectInfo } from 'dockerode';

export class DockerHelper implements BaseHelper {
    private docker: Docker;

    constructor() {
        this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    }

    async initialize(): Promise<void> {
        console.log('Docker Helper initialized');
    }

    async createContainer(options: ContainerCreateOptions): Promise<Container> {
        try {
            const container = this.docker.createContainer(options);
            return container;
        } catch(error) {
            console.error(`Error creating container: ${error}`);
            throw error;
        }
    }

    async startContainer(containerId: string): Promise<void> {
        try {
            const container = this.docker.getContainer(containerId);
            await container.start();
        } catch(error) {
            console.error(`Error starting container: ${error}`);
            throw error;
        }
    }

    async stopContainer(containerId: string): Promise<void> {
        try {
            const container = this.docker.getContainer(containerId);
            await container.stop();
        } catch(error) {
            console.error(`Error stopping container: ${error}`);
            throw error;
        }
    }

    async restartContainer(containerId: string): Promise<void> {
        try {
            const container = this.docker.getContainer(containerId);
            await container.restart();
        } catch(error) {
            console.error(`Error restarting container: ${error}`);
            throw error;
        }
    }

    async removeContainer(containerId: string): Promise<void> {
        try {
            const container = this.docker.getContainer(containerId);
            await container.remove();
        } catch(error) {
            console.error(`Error removing container: ${error}`);
            throw error;
        }
    }

    async inspectContainer(containerId: string): Promise<ContainerInspectInfo> {
        try {
            const container = this.docker.getContainer(containerId);
            return await container.inspect();
        } catch(error) {
            console.error(`Error getting container: ${error}`);
            throw error;
        }
    }

    async getContainerLogs(containerId: string): Promise<string> {
        try {
            const container = this.docker.getContainer(containerId);
            const logStream = await container.logs({
                follow: false,
                stdout: true,
                stderr: true
            });

            return logStream.toString('utf8');
        } catch(error) {
            console.error(`Error fetching container logs: ${error}`);
            throw error;
        }
    }

    async pullImage(imageName: string): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
                    if (err) return reject(err);
                    this.docker.modem.followProgress(stream, (err: Error | null) => {
                        if (err) reject(err);
                        else resolve();
                    })
                })
            })
        } catch(error) {
            console.error(`Error pulling image ${imageName}: ${error}`);
            throw error;
        }
    }

    async listImages(): Promise<Docker.ImageInfo[]> {
        try {
            return await this.docker.listImages({});
        } catch(error) {
            console.error(`Error listing images: ${error}`);
            throw error;
        }
    }

    async removeImage(imageName: string): Promise<void> {
        try {
            const image = this.docker.getImage(imageName);
            await image.remove();
        } catch(error) {
            console.error(`Error removing image ${imageName}: ${error}`);
            throw error;
        }
    }
}