import { Request, Response } from 'express'
import { registerUserService, loginUserService, getCurrentUserService, findUserByEmailService } from './auth.services'
import { RegisterBody, LoginBody } from './auth.validation'
import { getAuthCookieOptions, getAuthCookieName, getClearAuthCookieOptions } from '../../common/auth/cookie'
import { asyncHandler } from '../../common/errors/asyncHandler'

export const register = asyncHandler ( async ( 
    req: Request,
    res: Response
) => {
    const { body } = res.locals.validated as {
        body: RegisterBody
    }
    const { name, email, password } = body

    const registeredUser = await registerUserService(name, email, password)

    res.status(201).json({
        message: "Registration successful",
        data: {
            user: {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                status: registeredUser.status,
                role: {
                    id: registeredUser.role.id,
                    name: registeredUser.role.name
                },
                createdAt: registeredUser.createdAt
            }
        }
    })
})

export const login = asyncHandler ( async (
    req: Request,
    res: Response
) => {

    const { body } = res.locals.validated as {
        body: LoginBody
    }
    const { email, password } = body

    const rawUser = await loginUserService(email, password)
    const { user, token } = rawUser
    res.cookie(getAuthCookieName(), token, getAuthCookieOptions())

    res.status(200).json({
        message: "Login succesful",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: {
                    id: user.role.id,
                    name: user.role.name
                },
            },
        }   
    })
})

export const getCurrentUser = asyncHandler ( async (
    req: Request,
    res: Response
) => {
    
    const user = await getCurrentUserService(req.auth!.id)

    res.status(200).json({
        message: "Current User",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: {
                    id: user.role.id,
                    name: user.role.name
                },
                permissions: user.permissions
            }
        }
    })
})

export const logout = asyncHandler( async (
    req: Request,
    res: Response
) => {
    
    res.clearCookie(getAuthCookieName(), getClearAuthCookieOptions())

    res.status(200).json({
        message: "Logout successful",
        data: null
    });
})